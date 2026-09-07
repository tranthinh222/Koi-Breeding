package com.koibreeding.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.koibreeding.domain.Dictionary;
import com.koibreeding.domain.Inventory;
import com.koibreeding.domain.Item;
import com.koibreeding.domain.Koi;
import com.koibreeding.domain.Mutation;
import com.koibreeding.domain.Pond;
import com.koibreeding.dto.request.RequestMoveKoiDTO;
import com.koibreeding.dto.request.RequestFeedKoiDTO;
import com.koibreeding.dto.request.RequestReleaseKoiDTO;
import com.koibreeding.dto.response.ResFeedKoiDTO;
import com.koibreeding.dto.response.ResItemInventory;
import com.koibreeding.dto.response.ResKoiDTO;
import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.enums.ItemType;
import com.koibreeding.repository.KoiRepository;
import com.koibreeding.util.formulas.KoiFormula;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@Service
public class KoiService {
    private final KoiFormula koiFormula;
    private final KoiRepository koiRepository;
    private final MutationService mutationService;
    private final DictionaryService koiDictionaryService;
    private final PondService pondService;
    private final InventoryService inventoryService;
    // private final ItemService itemService;

    public KoiService(
            KoiRepository koiRepository,
            MutationService mutationService,
            DictionaryService koiDictionaryService,
            PondService pondService,
            InventoryService inventoryService, KoiFormula koiFormula) {
        this.koiRepository = koiRepository;
        this.mutationService = mutationService;
        this.koiDictionaryService = koiDictionaryService;
        this.pondService = pondService;
        this.inventoryService = inventoryService;
        this.koiFormula = koiFormula;
        // this.itemService = itemService;
    }

    public Koi handleCreateKoi(Koi koi) {
        return this.koiRepository.save(koi);
    }

    @Transactional
    public List<ResKoiDTO> handleReleaseKoi(RequestReleaseKoiDTO requestReleaseKoiDTO) throws Exception {
        Pond requestPond = pondService.handleFetchPondById(requestReleaseKoiDTO.getPondId());
        if (requestPond == null) {
            throw new Exception("Pond with id='" + requestReleaseKoiDTO.getPondId() + "' is not exist.");
        }

        Inventory requestInventory = inventoryService.handleFetchInventoryById(requestReleaseKoiDTO.getInventoryId());
        if (requestInventory == null) {
            throw new Exception(
                    "Item in inventory with id='" + requestReleaseKoiDTO.getInventoryId() + "' is not exist.");
        }

        if (requestInventory.getQuantity() < requestReleaseKoiDTO.getQuantity()) {
            throw new Exception("Invalid number of released fish. It must be less than or equal '"
                    + requestInventory.getQuantity() + "' but received '" + requestReleaseKoiDTO.getQuantity() + "'.");
        }

        Item requestItem = requestInventory.getItem();
        if (!requestItem.getItemType().equals(ItemType.KOI)) {
            throw new Exception("Invalid item type. Item must be a KOI item");
        }

        Dictionary requestDictionary = this.koiDictionaryService
                .handleFetchDictionaryById(requestItem.getEffectValue().intValue());

        if (requestDictionary == null) {
            throw new Exception("Item value does not match any koi varient.");
        }

        List<Koi> newKoiList = new ArrayList<Koi>();

        for (int i = 0; i < requestReleaseKoiDTO.getQuantity(); ++i) {
            newKoiList.add(koiFormula.generateStarterKoi(requestDictionary, requestPond));
        }

        List<Koi> resultKoiList = this.koiRepository.saveAll(newKoiList);

        inventoryService.useItemFromInventory(requestPond.getOwner().getId(), requestItem.getId(),
                requestReleaseKoiDTO.getQuantity());

        return resultKoiList.stream().map(this::convertToResKoiDTO)
                .collect(Collectors.toList());
    }

    public ResKoiDTO handleMoveKoi(RequestMoveKoiDTO requestMoveKoiDTO) throws Exception {
        Koi targetKoi = this.handleFetchKoiById(requestMoveKoiDTO.getTargetKoiId());
        if (targetKoi == null) {
            throw new Exception("Koi with id='" + requestMoveKoiDTO.getTargetKoiId() + "' does not exist.");
        }

        Pond sourcePond = this.pondService.handleFetchPondById(requestMoveKoiDTO.getSourcePondId());
        if (sourcePond == null) {
            throw new Exception("Source pond with id='" + requestMoveKoiDTO.getSourcePondId() + "' does not exist.");
        }

        Pond targetPond = this.pondService.handleFetchPondById(requestMoveKoiDTO.getTargetPondId());
        if (targetPond == null) {
            throw new Exception("Target pond with id='" + requestMoveKoiDTO.getTargetPondId() + "' does not exist.");
        }

        long targetPondQuantity = this.handleGetKoisQuantityInPond(targetPond.getId());
        if (targetPondQuantity == targetPond.getCapacity()) {
            throw new Exception("Target pond with id='" + targetPond.getId() + "' is full.");
        }

        targetKoi.setPond(targetPond);

        return this.convertToResKoiDTO(this.koiRepository.save(targetKoi));
    }

    @Transactional
    public ResFeedKoiDTO handleFeedKoi(Integer koiId, RequestFeedKoiDTO request) {
        Koi koi = this.handleFetchKoiById(koiId);
        if (koi == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Koi with id '" + koiId + "' does not exist.");
        }

        if (koi.getPond() == null || koi.getPond().getOwner() == null
                || !request.userId().equals(koi.getPond().getOwner().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot feed a koi that you do not own.");
        }

        int currentFoodBar = koi.getFoodBar() == null ? 0 : koi.getFoodBar();
        if (currentFoodBar >= 100) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This koi is already full.");
        }

        Inventory inventory = inventoryService.handleFetchInventoryByUserAndItem(request.userId(), request.itemId());
        if (inventory == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Food item was not found in the user's inventory.");
        }

        Item food = inventory.getItem();
        if (food == null || food.getItemType() != ItemType.FOOD) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only FOOD items can be used to feed koi.");
        }
        if (food.getEffectValue() == null || food.getEffectValue().signum() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Food effect value must be greater than zero.");
        }
        if (inventory.getQuantity() < request.quantity()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Insufficient food quantity.");
        }

        int foodRestored = food.getEffectValue()
                .multiply(java.math.BigDecimal.valueOf(request.quantity()))
                .min(java.math.BigDecimal.valueOf(100L - currentFoodBar))
                .intValue();

        koi.setFoodBar(currentFoodBar + foodRestored);
        Koi updatedKoi = koiRepository.save(koi);
        ResItemInventory remainingInventory = inventoryService.useItemFromInventory(
                request.userId(), request.itemId(), request.quantity());

        return new ResFeedKoiDTO(
                this.convertToResKoiDTO(updatedKoi),
                foodRestored,
                request.quantity(),
                remainingInventory.getQuantity());
    }

    public Koi handleUpdateKoi(Koi koi) {
        Koi currentKoi = this.handleFetchKoiById(koi.getId());
        if (currentKoi != null) {
            currentKoi.setName(koi.getName() != null ? koi.getName() : currentKoi.getName());
            currentKoi.setAge(koi.getAge() != null ? koi.getAge() : currentKoi.getAge());
            currentKoi.setGender(koi.getGender() != null ? koi.getGender() : currentKoi.getGender());
            currentKoi.setLength(koi.getLength() != null ? koi.getLength() : currentKoi.getLength());
            currentKoi.setWeight(koi.getWeight() != null ? koi.getWeight() : currentKoi.getWeight());
            currentKoi.setHealth(koi.getHealth() != null ? koi.getHealth() : currentKoi.getHealth());
            currentKoi.setFoodBar(koi.getFoodBar() != null ? koi.getFoodBar() : currentKoi.getFoodBar());
            currentKoi.setPrice(koi.getPrice() != null ? koi.getPrice() : currentKoi.getPrice());

            if (koi.getMutation() != null) {
                Mutation mutation = this.mutationService.handleFetchMutationById(koi.getMutation().getId());
                currentKoi.setMutation(mutation);
            }

            if (koi.getPond() != null) {
                Pond pond = this.pondService.handleFetchPondById(koi.getPond().getId());
                currentKoi.setPond(pond);
            }

            currentKoi.setPond(new Pond());
            currentKoi.setLifeStage(koi.getLifeStage() != null ? koi.getLifeStage() : currentKoi.getLifeStage());
            currentKoi.setFather(koi.getFather() != null ? koi.getFather() : currentKoi.getFather());
            currentKoi.setMother(koi.getMother() != null ? koi.getMother() : currentKoi.getMother());
            currentKoi.setPotential(koi.getPotential() != null ? koi.getPotential() : currentKoi.getPotential());

            if (koi.getDictionary() != null) {
                Dictionary koiDictionary = this.koiDictionaryService
                        .handleFetchDictionaryById(koi.getDictionary().getId());
                currentKoi.setDictionary(koiDictionary);
            }

            currentKoi.setPatternScore(
                    koi.getPatternScore() != null ? koi.getPatternScore() : currentKoi.getPatternScore());
            currentKoi.setColorScore(koi.getColorScore() != null ? koi.getColorScore() : currentKoi.getColorScore());
            currentKoi.setBodyScore(koi.getBodyScore() != null ? koi.getBodyScore() : currentKoi.getBodyScore());
            currentKoi.setSkinScore(koi.getSkinScore() != null ? koi.getSkinScore() : currentKoi.getSkinScore());
            currentKoi.setScaleScore(koi.getScaleScore() != null ? koi.getScaleScore() : currentKoi.getScaleScore());

            currentKoi = this.koiRepository.save(currentKoi);
        }

        return currentKoi;
    }

    public Koi handleFetchKoiById(Integer id) {
        return koiRepository.findById(id).orElse(null);
    }

    public ResultPaginationDTO handleFetchAllKois(Pageable pageable) {
        Page<Koi> pageKoi = this.koiRepository.findAll(pageable);
        ResultPaginationDTO resultPaginationDTO = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setTotalPages(pageKoi.getTotalPages());
        meta.setTotalElements(pageKoi.getTotalElements());

        resultPaginationDTO.setMeta(meta);

        List<Koi> koiList = pageKoi.getContent();

        resultPaginationDTO.setResult(koiList);

        return resultPaginationDTO;
    }

    public List<ResKoiDTO> handleFetchAllKoisInPond(Integer pondId) {
        return this.koiRepository.findAllByPond_Id(pondId).stream().map(this::convertToResKoiDTO)
                .collect(Collectors.toList());
    }

    public long handleGetKoisQuantityInPond(Integer pondId) {
        return this.koiRepository.countByPond_Id(pondId);
    }

    public void handleDeleteKoi(Integer id) {
        this.koiRepository.deleteById(id);
    }

    public boolean isKoiExistById(Integer id) {
        return this.koiRepository.existsById(id);
    }

    public ResKoiDTO convertToResKoiDTO(Koi koi) {
        ResKoiDTO resKoiDTO = new ResKoiDTO();
        ResKoiDTO.KoiMutation koiMutation = null;

        if (koi.getMutation() != null) {
            koiMutation = new ResKoiDTO.KoiMutation();
            koiMutation.setId(koi.getMutation().getId());
            koiMutation.setName(koi.getMutation().getName());
        }

        resKoiDTO.setId(koi.getId());
        resKoiDTO.setName(koi.getName());
        resKoiDTO.setAge(koi.getAge());
        resKoiDTO.setLength(koi.getLength());
        resKoiDTO.setWeight(koi.getWeight());
        resKoiDTO.setHealth(koi.getHealth());
        resKoiDTO.setFoodBar(koi.getFoodBar());
        resKoiDTO.setGender(koi.getGender());
        resKoiDTO.setPrice(koi.getPrice());
        resKoiDTO.setMutation(koiMutation);
        resKoiDTO.setBornedAt(koi.getBornedAt().toInstant());
        resKoiDTO.setPondId(koi.getPond().getId());
        resKoiDTO.setLifeStage(koi.getLifeStage());
        Koi father = koi.getFather();
        Koi mother = koi.getMother();

        if (father != null) {
            ResKoiDTO.KoiParent fatherData = new ResKoiDTO.KoiParent();
            fatherData.setId(father.getId());
            fatherData.setName(father.getName());
            fatherData.setImageUrl(father.getDictionary().getImageUrl());
            Integer koiUser = koi.getPond().getOwner().getId();
            Integer fatherUser = father.getPond().getOwner().getId();
            fatherData.setBelongToUser(koiUser.equals(fatherUser));
            resKoiDTO.setFather(fatherData);
        }

        if (mother != null) {
            ResKoiDTO.KoiParent motherData = new ResKoiDTO.KoiParent();
            motherData.setId(mother.getId());
            motherData.setName(mother.getName());
            motherData.setImageUrl(mother.getDictionary().getImageUrl());
            Integer koiUser = koi.getPond().getOwner().getId();
            Integer motherUser = mother.getPond().getOwner().getId();
            motherData.setBelongToUser(koiUser.equals(motherUser));
            resKoiDTO.setFather(motherData);
        }

        resKoiDTO.setPotential(koi.getPotential());
        resKoiDTO.setDictionary(koi.getDictionary());
        resKoiDTO.setPatternScore(koi.getPatternScore());
        resKoiDTO.setColorScore(koi.getColorScore());
        resKoiDTO.setBodyScore(koi.getBodyScore());
        resKoiDTO.setSkinScore(koi.getSkinScore());
        resKoiDTO.setScaleScore(koi.getScaleScore());

        return resKoiDTO;
    }
}
