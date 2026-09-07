package com.koibreeding.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.koibreeding.domain.BreedingRate;
import com.koibreeding.domain.Dictionary;
import com.koibreeding.dto.request.RequestCreateOrUpdateBreedingRateDTO;
import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.enums.BreedingRecipeType;
import com.koibreeding.enums.ScaleType;
import com.koibreeding.enums.Shape;
import com.koibreeding.repository.BreedingRateRepository;

@Service
public class BreedingRateService {
    private final BreedingRateRepository repository;
    private final DictionaryService dictionaryService;

    public BreedingRateService(BreedingRateRepository repository, DictionaryService dictionaryService) {
        this.repository = repository;
        this.dictionaryService = dictionaryService;
    }

    public ResultPaginationDTO search(String search, BreedingRecipeType type, Integer varietyId,
            Shape shape, ScaleType scaleType, Pageable pageable) {
        Specification<BreedingRate> spec = (root, query, cb) -> cb.conjunction();
        if (search != null && !search.isBlank()) {
            String term = "%" + search.trim().toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("child").get("name")), term));
        }
        if (type != null)
            spec = spec.and((root, query, cb) -> cb.equal(root.get("type"), type));
        if (varietyId != null)
            spec = spec.and((root, query, cb) -> cb.equal(root.get("child").get("variety").get("id"), varietyId));
        if (shape != null)
            spec = spec.and((root, query, cb) -> cb.equal(root.get("child").get("shape"), shape));
        if (scaleType != null)
            spec = spec.and((root, query, cb) -> cb.equal(root.get("child").get("scaleType"), scaleType));
        return paginate(repository.findAll(spec, pageable), pageable);
    }

    public List<BreedingRate> findPair(Integer fatherDictionaryId, Integer motherDictionaryId) {
        return repository.findByFatherIdAndMotherId(fatherDictionaryId, motherDictionaryId);
    }

    public List<BreedingRate> findPairIncludingReverse(Integer fatherDictionaryId, Integer motherDictionaryId) {
        List<BreedingRate> direct = findPair(fatherDictionaryId, motherDictionaryId);
        return direct.isEmpty() ? findPair(motherDictionaryId, fatherDictionaryId) : direct;
    }

    public BreedingRate handleCreateBreedingRate(RequestCreateOrUpdateBreedingRateDTO request) throws Exception {
        Dictionary father = dictionaryService.handleFetchDictionaryById(request.getFatherId());
        if (father == null) {
            throw new Exception("Father with id='" + request.getFatherId() + "' does not exist");
        }

        Dictionary mother = dictionaryService.handleFetchDictionaryById(request.getMotherId());
        if (mother == null) {
            throw new Exception("Mother with id='" + request.getMotherId() + "' does not exist");
        }

        Dictionary target = dictionaryService.handleFetchDictionaryById(request.getChildId());
        if (target == null) {
            throw new Exception("Target with id='" + request.getChildId() + "' does not exist");
        }

        if (father.getVariety().getId().equals(mother.getVariety().getId())
                && !request.getType().equals(BreedingRecipeType.PURE)) {
            throw new Exception("Parent have the same variety, but received '" + request.getType() + "' breeding type");
        }

        if (repository.findByFatherIdAndMotherIdAndChildId(father.getId(), mother.getId(), target.getId())
                .orElse(null) == null) {
            throw new Exception("The Breeding Recipe '" + father.getName() + "' x '" + mother.getName() + "' = '"
                    + target.getName() + "' already exists");
        }

        BigDecimal total = request.getFatherRate().add(request.getMotherRate()).add(request.getTargetRate());
        if (total.compareTo(BigDecimal.valueOf(1.0)) > 0) {
            throw new Exception("Total breeding rate (father_rate + mother_rate + target_rate) cannot exceed 100%");
        }

        BreedingRate newBreedingRate = new BreedingRate(null, father, mother, target, request.getType(),
                request.getTargetRate(), request.getFatherRate(), request.getMotherRate());

        return repository.save(newBreedingRate);
    }

    public BreedingRate handleUpdateBreedingRate(Integer id, RequestCreateOrUpdateBreedingRateDTO request)
            throws Exception {
        BreedingRate oldBreedingRate = repository.findById(id).orElse(null);
        if (oldBreedingRate == null) {
            throw new Exception("Breeding Rate with id='" + id + "' does not exist");
        }

        Dictionary father = dictionaryService.handleFetchDictionaryById(request.getFatherId());
        if (father == null) {
            throw new Exception("Father with id='" + request.getFatherId() + "' does not exist");
        }

        Dictionary mother = dictionaryService.handleFetchDictionaryById(request.getMotherId());
        if (mother == null) {
            throw new Exception("Mother with id='" + request.getMotherId() + "' does not exist");
        }

        Dictionary target = dictionaryService.handleFetchDictionaryById(request.getChildId());
        if (target == null) {
            throw new Exception("Target with id='" + request.getChildId() + "' does not exist");
        }

        if (father.getVariety().getId() == mother.getVariety().getId()
                && !request.getType().equals(BreedingRecipeType.PURE)) {
            throw new Exception("Parent have the same variety, but received '" + request.getType() + "' breeding type");
        }

        BreedingRate checkExist = repository
                .findByFatherIdAndMotherIdAndChildId(father.getId(), mother.getId(), target.getId()).orElse(null);

        if (!checkExist.getId().equals(oldBreedingRate.getId())) {
            throw new Exception("The Breeding Recipe '" + father.getName() + "' x '" + mother.getName() + "' = '"
                    + target.getName() + "' already exists");
        }

        BigDecimal total = request.getFatherRate().add(request.getMotherRate()).add(request.getTargetRate());
        if (total.compareTo(BigDecimal.valueOf(1.0)) > 0) {
            throw new Exception("Total breeding rate (father_rate + mother_rate + target_rate) cannot exceed 100%");
        }

        oldBreedingRate.setFather(father);
        oldBreedingRate.setMother(mother);
        oldBreedingRate.setChild(target);
        oldBreedingRate.setType(request.getType());
        oldBreedingRate.setTargetRate(request.getTargetRate());
        oldBreedingRate.setFatherRate(request.getFatherRate());
        oldBreedingRate.setMotherRate(request.getMotherRate());

        return repository.save(oldBreedingRate);
    }

    public BreedingRate handleFetchBreedingRateById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public List<BreedingRate> handleFetchBreedingRateByFatherAndMother(Integer fatherId, Integer motherId) {
        return findPair(fatherId, motherId);
    }

    public void handleDeleteBreedingRateById(Integer id) {
        repository.deleteById(id);
    }

    private ResultPaginationDTO paginate(Page<BreedingRate> page, Pageable pageable) {
        ResultPaginationDTO result = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();
        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setTotalPages(page.getTotalPages());
        meta.setTotalElements(page.getTotalElements());
        result.setMeta(meta);
        result.setResult(page.getContent());
        return result;
    }
}
