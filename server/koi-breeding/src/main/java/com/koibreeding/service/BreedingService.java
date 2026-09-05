package com.koibreeding.service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.koibreeding.domain.*;
import com.koibreeding.dto.request.CreateBreedingEventRequest;
import com.koibreeding.dto.response.ResBreedingEventDTO;
import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.enums.*;
import com.koibreeding.repository.*;
import com.koibreeding.util.formulas.BreedingFormula;
import com.koibreeding.util.formulas.KoiFormula;

@Service
public class BreedingService {
    private static final List<BreedingStatus> TERMINAL = List.of(BreedingStatus.COMPLETED, BreedingStatus.CANCELLED);
    private final BreedingEventRepository eventRepository;
    private final UserRepository userRepository;
    private final PondRepository pondRepository;
    private final KoiRepository koiRepository;
    private final BreedingRateService rateService;
    private final BreedingFormula breedingFormula;
    private final KoiFormula koiFormula;
    private final KoiService koiService;
    private final NotificationService notificationService;

    public BreedingService(BreedingEventRepository eventRepository, UserRepository userRepository,
            PondRepository pondRepository, KoiRepository koiRepository, BreedingRateService rateService,
            BreedingFormula breedingFormula, KoiFormula koiFormula, KoiService koiService,
            NotificationService notificationService) {
        this.eventRepository = eventRepository; this.userRepository = userRepository; this.pondRepository = pondRepository;
        this.koiRepository = koiRepository; this.rateService = rateService; this.breedingFormula = breedingFormula;
        this.koiFormula = koiFormula; this.koiService = koiService; this.notificationService = notificationService;
    }

    @Transactional
    public ResBreedingEventDTO create(CreateBreedingEventRequest request) {
        User user = userRepository.findById(request.userId()).orElseThrow(() -> notFound("User"));
        Pond pond = pondRepository.findById(request.pondId()).orElseThrow(() -> notFound("Isolation pond"));
        Koi father = koiRepository.findById(request.fatherId()).orElseThrow(() -> notFound("Father koi"));
        Koi mother = koiRepository.findById(request.motherId()).orElseThrow(() -> notFound("Mother koi"));
        requireOwned(user, pond, "Isolation pond"); requireOwned(user, father); requireOwned(user, mother);
        if (father.getId().equals(mother.getId())) badRequest("Father and mother must be different koi.");
        if (father.getGender() != Gender.MALE || mother.getGender() != Gender.FEMALE)
            badRequest("Father must be MALE and mother must be FEMALE.");
        if (isActive(father.getId()) || isActive(mother.getId()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A selected parent is already in an active breeding event.");

        BigDecimal score = breedingFormula.calculateBreedScore(father, mother, pond);
        int eggs = breedingFormula.calculateLaidEggs(score, request.breedingType());
        long occupants = koiRepository.countByPond_Id(pond.getId());
        int incomingParents = (father.getPond().getId().equals(pond.getId()) ? 0 : 1)
                + (mother.getPond().getId().equals(pond.getId()) ? 0 : 1);
        if (occupants + incomingParents + eggs > pond.getCapacity())
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Isolation pond needs room for both parents and " + eggs + " estimated eggs.");

        OffsetDateTime startedAt = OffsetDateTime.now();
        long breedingSeconds = breedingFormula.calculateBreedTime(score).multiply(BigDecimal.valueOf(3600)).longValue();
        BreedingEvent event = new BreedingEvent();
        event.setUser(user); event.setMale(father); event.setFemale(mother); event.setPond(pond);
        event.setBreedingType(request.breedingType()); event.setStatus(BreedingStatus.STARTED);
        event.setStartedAt(startedAt); event.setExpectedHatchDate(startedAt.plusSeconds(breedingSeconds));
        event.setExpectedEggCount(eggs); event.setOffspringGenerated(false);
        father.setPond(pond); mother.setPond(pond); koiRepository.saveAll(List.of(father, mother));
        event = eventRepository.save(event);
        notificationService.createAndSend(user.getId(), NotificationType.SYSTEM, "Breeding started",
                "Breeding event #" + event.getId() + " started with " + eggs + " estimated eggs.");
        return toDto(event);
    }

    @Transactional(readOnly = true)
    public ResultPaginationDTO search(Integer userId, String search, BreedingType type, BreedingStatus status,
            Integer pondId, Boolean ended, Pageable pageable) {
        Specification<BreedingEvent> spec = (root, query, cb) -> cb.equal(root.get("user").get("id"), userId);
        if (search != null && !search.isBlank()) {
            String term = "%" + search.trim().toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("male").get("name")), term),
                    cb.like(cb.lower(root.get("female").get("name")), term)));
        }
        if (type != null) spec = spec.and((root, query, cb) -> cb.equal(root.get("breedingType"), type));
        if (status != null) spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        if (pondId != null) spec = spec.and((root, query, cb) -> cb.equal(root.get("pond").get("id"), pondId));
        if (ended != null) spec = spec.and((root, query, cb) -> ended
                ? root.get("status").in(TERMINAL) : cb.not(root.get("status").in(TERMINAL)));
        Page<BreedingEvent> page = eventRepository.findAll(spec, pageable);
        ResultPaginationDTO result = new ResultPaginationDTO(); ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();
        meta.setPage(pageable.getPageNumber() + 1); meta.setPageSize(pageable.getPageSize());
        meta.setTotalPages(page.getTotalPages()); meta.setTotalElements(page.getTotalElements());
        result.setMeta(meta); result.setResult(page.getContent().stream().map(this::toDto).toList()); return result;
    }

    @Transactional
    public ResBreedingEventDTO advance(Integer id, Integer userId) {
        BreedingEvent event = ownedEvent(id, userId);
        if (event.getBreedingType() != BreedingType.MANUAL) badRequest("Only manual events can be advanced by the user.");
        if (!isDue(event, next(event.getStatus()), OffsetDateTime.now()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "The next breeding stage is not ready yet.");
        transition(event, next(event.getStatus())); return toDto(eventRepository.save(event));
    }

    @Transactional
    public ResBreedingEventDTO cancel(Integer id, Integer userId) {
        BreedingEvent event = ownedEvent(id, userId);
        if (TERMINAL.contains(event.getStatus())) badRequest("This breeding event has already ended.");
        event.setStatus(BreedingStatus.CANCELLED); event.setEndedAt(OffsetDateTime.now());
        notificationService.createAndSend(userId, NotificationType.BREEDING_FAILED, "Breeding cancelled",
                "Breeding event #" + id + " was cancelled.");
        return toDto(eventRepository.save(event));
    }

    @Scheduled(fixedDelay = 60000)
    @Transactional
    public void processDueEvents() {
        OffsetDateTime now = OffsetDateTime.now();
        for (BreedingEvent event : eventRepository.findByStatusNotIn(TERMINAL)) {
            BreedingStatus target = next(event.getStatus());
            if (!isDue(event, target, now)) continue;
            if (event.getBreedingType() == BreedingType.AUTOMATIC) {
                transition(event, target); eventRepository.save(event);
            } else if (event.getLastReminderAt() == null) {
                notificationService.createAndSend(event.getUser().getId(), NotificationType.SYSTEM,
                        "Breeding action ready", "Event #" + event.getId() + " is ready for " + target + ".");
                event.setLastReminderAt(now); eventRepository.save(event);
            }
        }
    }

    private void transition(BreedingEvent event, BreedingStatus target) {
        if (target == BreedingStatus.ISOLATED) isolateParents(event);
        if (target == BreedingStatus.HATCHED && !event.getOffspringGenerated()) hatch(event);
        event.setStatus(target); event.setLastReminderAt(null);
        if (target == BreedingStatus.COMPLETED) event.setEndedAt(OffsetDateTime.now());
        NotificationType type = target == BreedingStatus.COMPLETED ? NotificationType.BREEDING_COMPLETED : NotificationType.SYSTEM;
        notificationService.createAndSend(event.getUser().getId(), type, "Breeding: " + target,
                "Breeding event #" + event.getId() + " moved to " + target + ".");
    }

    private void hatch(BreedingEvent event) {
        List<BreedingRate> direct = rateService.findPair(event.getMale().getDictionary().getId(), event.getFemale().getDictionary().getId());
        boolean reversed = direct.isEmpty();
        List<BreedingRate> rates = reversed ? rateService.findPair(event.getFemale().getDictionary().getId(), event.getMale().getDictionary().getId()) : direct;
        int available = Math.max(0, event.getPond().getCapacity() - (int) koiRepository.countByPond_Id(event.getPond().getId()));
        int attempts = Math.min(event.getExpectedEggCount(), available);
        for (int i = 0; i < attempts; i++) {
            Dictionary child = chooseChild(rates, reversed, event.getMale().getDictionary(), event.getFemale().getDictionary());
            if (child == null) continue;
            Koi koi = koiFormula.generateStarterKoi(child, event.getPond());
            koi.setAge(0); koi.setLifeStage(LifeStage.EGG); koi.setName(child.getName());
            koi.setFather(event.getMale()); koi.setMother(event.getFemale()); koiRepository.save(koi);
        }
        event.setOffspringGenerated(true);
    }

    private Dictionary chooseChild(List<BreedingRate> rates, boolean reversed, Dictionary father, Dictionary mother) {
        if (rates.isEmpty()) return ThreadLocalRandom.current().nextBoolean() ? father : mother;
        double multiplier = reversed ? 0.25 : 1.0, roll = ThreadLocalRandom.current().nextDouble(), cursor = 0;
        for (BreedingRate rate : rates) { cursor += rate.getTargetRate().doubleValue() * multiplier; if (roll < cursor) return rate.getChild(); }
        BreedingRate first = rates.get(0);
        cursor += first.getFatherRate().doubleValue() * multiplier; if (roll < cursor) return first.getFather();
        cursor += first.getMotherRate().doubleValue() * multiplier; if (roll < cursor) return first.getMother();
        return null;
    }

    private void isolateParents(BreedingEvent event) {
        pondRepository.findAll().stream().filter(p -> p.getOwner().getId().equals(event.getUser().getId()))
                .filter(p -> !p.getId().equals(event.getPond().getId()))
                .filter(p -> koiRepository.countByPond_Id(p.getId()) + 2 <= p.getCapacity()).findFirst()
                .ifPresent(p -> { event.getMale().setPond(p); event.getFemale().setPond(p); koiRepository.saveAll(List.of(event.getMale(), event.getFemale())); });
    }

    private boolean isActive(Integer koiId) {
        return eventRepository.findByStatusNotIn(TERMINAL).stream()
                .anyMatch(e -> e.getMale().getId().equals(koiId) || e.getFemale().getId().equals(koiId));
    }
    private BreedingStatus next(BreedingStatus status) {
        return switch (status) { case STARTED -> BreedingStatus.EGG_LAID; case EGG_LAID -> BreedingStatus.ISOLATED;
            case ISOLATED -> BreedingStatus.HATCHED; case HATCHED -> BreedingStatus.COMPLETED;
            default -> throw new ResponseStatusException(HttpStatus.CONFLICT, "Breeding event cannot advance."); };
    }
    private boolean isDue(BreedingEvent e, BreedingStatus target, OffsetDateTime now) {
        Duration total = Duration.between(e.getStartedAt(), e.getExpectedHatchDate());
        OffsetDateTime due = switch (target) { case EGG_LAID -> e.getStartedAt().plus(total.dividedBy(5));
            case ISOLATED -> e.getStartedAt().plus(total.multipliedBy(2).dividedBy(5));
            case HATCHED -> e.getExpectedHatchDate(); case COMPLETED -> e.getExpectedHatchDate().plusDays(1);
            default -> OffsetDateTime.MAX; };
        return !now.isBefore(due);
    }
    private BreedingEvent ownedEvent(Integer id, Integer userId) {
        BreedingEvent e = eventRepository.findById(id).orElseThrow(() -> notFound("Breeding event"));
        if (!e.getUser().getId().equals(userId)) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Breeding event does not belong to this user.");
        return e;
    }
    private void requireOwned(User user, Pond pond, String label) { if (!pond.getOwner().getId().equals(user.getId())) throw new ResponseStatusException(HttpStatus.FORBIDDEN, label + " does not belong to this user."); }
    private void requireOwned(User user, Koi koi) { if (koi.getPond() == null || !koi.getPond().getOwner().getId().equals(user.getId())) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Koi does not belong to this user."); }
    private ResponseStatusException notFound(String value) { return new ResponseStatusException(HttpStatus.NOT_FOUND, value + " was not found."); }
    private void badRequest(String message) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST, message); }
    private ResBreedingEventDTO toDto(BreedingEvent e) { return new ResBreedingEventDTO(e.getId(), new ResBreedingEventDTO.Owner(e.getUser().getId(), e.getUser().getUsername()),
            koiService.convertToResKoiDTO(e.getMale()), koiService.convertToResKoiDTO(e.getFemale()),
            new ResBreedingEventDTO.PondSummary(e.getPond().getId(), e.getPond().getName()), e.getBreedingType(),
            e.getStartedAt(), e.getExpectedHatchDate(), e.getEndedAt(), e.getStatus(), e.getExpectedEggCount()); }
}
