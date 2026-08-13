package com.koibreeding.service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.koibreeding.domain.Pond;
import com.koibreeding.domain.User;
import com.koibreeding.domain.response.ResultPaginationDTO;
import com.koibreeding.repository.PondRepository;

@Service
public class PondService {
    private final PondRepository pondRepository;
    private final UserService userService;

    public PondService(PondRepository pondRepository, UserService userService) {
        this.pondRepository = pondRepository;
        this.userService = userService;
    }

    public Pond handleCreatePond(Pond pond) {
        return this.pondRepository.save(pond);
    }

    public Pond handleUpdatePond(Pond pond) {
        Pond currentPond = this.handleFetchPondById(pond.getId());
        if (currentPond != null) {
            currentPond.setName(pond.getName() != null ? pond.getName() : currentPond.getName());

            if (pond.getOwner() != null) {
                User owner = this.userService.handleFetchUserById(pond.getOwner().getId());
                currentPond.setOwner(owner);
            }

            currentPond.setLevel(pond.getLevel() != null ? pond.getLevel() : currentPond.getLevel());
            currentPond.setCapacity(pond.getCapacity() != null ? pond.getCapacity() : currentPond.getCapacity());
            currentPond.setWaterQuality(
                    pond.getWaterQuality() != null ? pond.getWaterQuality() : currentPond.getWaterQuality());
            currentPond.setTemperature(
                    pond.getTemperature() != null ? pond.getTemperature() : currentPond.getTemperature());
            currentPond.setPH(pond.getPH() != null ? pond.getPH() : currentPond.getPH());
            currentPond.setOxygen(pond.getOxygen() != null ? pond.getOxygen() : currentPond.getOxygen());
            currentPond.setDescription(
                    pond.getDescription() != null ? pond.getDescription() : currentPond.getDescription());

            currentPond = this.pondRepository.save(currentPond);
        }

        return currentPond;
    }

    public Pond handleFetchPondById(Integer id) {
        return pondRepository.findById(id).orElse(null);
    }

    public ResultPaginationDTO handleFetchAllPonds(Pageable pageable) {
        Page<Pond> pagePond = this.pondRepository.findAll(pageable);
        ResultPaginationDTO resultPaginationDTO = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setTotalPages(pagePond.getTotalPages());
        meta.setTotalElements(pagePond.getTotalElements());

        resultPaginationDTO.setMeta(meta);

        List<Pond> pondList = pagePond.getContent();

        resultPaginationDTO.setResult(pondList);

        return resultPaginationDTO;
    }

    public ResultPaginationDTO handleFetchPondsByOwner(Integer id, Pageable pageable) {
        Page<Pond> pagePond = this.pondRepository.findAllByOwner(id, pageable);
        ResultPaginationDTO resultPaginationDTO = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setTotalPages(pagePond.getTotalPages());
        meta.setTotalElements(pagePond.getTotalElements());

        resultPaginationDTO.setMeta(meta);

        List<Pond> pondList = pagePond.getContent();

        resultPaginationDTO.setResult(pondList);

        return resultPaginationDTO;
    }

    public void handleDeletePond(Integer id) {
        this.pondRepository.deleteById(id);
    }

    public boolean isPondExistById(Integer id) {
        return this.pondRepository.existsById(id);
    }
}
