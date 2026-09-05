package com.koibreeding.service;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import com.koibreeding.domain.BreedingRate;
import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.enums.BreedingRecipeType;
import com.koibreeding.enums.ScaleType;
import com.koibreeding.enums.Shape;
import com.koibreeding.repository.BreedingRateRepository;

@Service
public class BreedingRateService {
    private final BreedingRateRepository repository;
    public BreedingRateService(BreedingRateRepository repository) { this.repository = repository; }

    public ResultPaginationDTO search(String search, BreedingRecipeType type, Integer varietyId,
            Shape shape, ScaleType scaleType, Pageable pageable) {
        Specification<BreedingRate> spec = (root, query, cb) -> cb.conjunction();
        if (search != null && !search.isBlank()) {
            String term = "%" + search.trim().toLowerCase() + "%";
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("child").get("name")), term));
        }
        if (type != null) spec = spec.and((root, query, cb) -> cb.equal(root.get("type"), type));
        if (varietyId != null) spec = spec.and((root, query, cb) -> cb.equal(root.get("child").get("variety").get("id"), varietyId));
        if (shape != null) spec = spec.and((root, query, cb) -> cb.equal(root.get("child").get("shape"), shape));
        if (scaleType != null) spec = spec.and((root, query, cb) -> cb.equal(root.get("child").get("scaleType"), scaleType));
        return paginate(repository.findAll(spec, pageable), pageable);
    }

    public List<BreedingRate> findPair(Integer fatherDictionaryId, Integer motherDictionaryId) {
        return repository.findByFatherIdAndMotherId(fatherDictionaryId, motherDictionaryId);
    }
    public List<BreedingRate> findPairIncludingReverse(Integer fatherDictionaryId, Integer motherDictionaryId) {
        List<BreedingRate> direct = findPair(fatherDictionaryId, motherDictionaryId);
        return direct.isEmpty() ? findPair(motherDictionaryId, fatherDictionaryId) : direct;
    }
    public BreedingRate handleCreateBreedingRate(BreedingRate rate) { return repository.save(rate); }
    public BreedingRate handleFetchBreedingRateById(Integer id) { return repository.findById(id).orElse(null); }
    public List<BreedingRate> handleFetchBreedingRateByFatherAndMother(Integer fatherId, Integer motherId) { return findPair(fatherId, motherId); }
    public void handleDeleteBreedingRateById(Integer id) { repository.deleteById(id); }

    private ResultPaginationDTO paginate(Page<BreedingRate> page, Pageable pageable) {
        ResultPaginationDTO result = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();
        meta.setPage(pageable.getPageNumber() + 1); meta.setPageSize(pageable.getPageSize());
        meta.setTotalPages(page.getTotalPages()); meta.setTotalElements(page.getTotalElements());
        result.setMeta(meta); result.setResult(page.getContent()); return result;
    }
}
