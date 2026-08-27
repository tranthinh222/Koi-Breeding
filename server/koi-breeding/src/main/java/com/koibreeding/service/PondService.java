package com.koibreeding.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.koibreeding.domain.Pond;
import com.koibreeding.domain.User;
import com.koibreeding.dto.request.RequestBuyPondDTO;
import com.koibreeding.dto.response.ResPondDTO;
import com.koibreeding.dto.response.ResultPaginationDTO;
import com.koibreeding.repository.PondRepository;
import com.koibreeding.util.formulas.PondFormula;

@Service
public class PondService {
    private final PondRepository pondRepository;
    private final UserService userService;
    private final WalletService walletService;

    public PondService(PondRepository pondRepository, UserService userService, WalletService walletService) {
        this.pondRepository = pondRepository;
        this.userService = userService;
        this.walletService = walletService;
    }

    @Transactional
    public ResPondDTO handleBuyPond(RequestBuyPondDTO buyPondRequestDTO) throws Exception {
        User owner = userService.handleFetchUserById(buyPondRequestDTO.getOwnerId());
        if (owner == null) {
            throw new Exception("Pond owner is not exist!");
        }

        BigDecimal ownerBalance = walletService.getBalanceWallet(owner.getId()).getBalance();
        BigDecimal pondPrice = BigDecimal.valueOf(buyPondRequestDTO.getPrice());
        if (ownerBalance.compareTo(pondPrice) < 0) {
            throw new Exception("You don't have enough koins to buy this pond!");
        }

        // Initialize a new pond
        Pond newPond = new Pond();
        newPond.setOwner(owner);
        newPond.setName(buyPondRequestDTO.getName());
        newPond.setLevel(1);
        newPond.setCapacity(1);
        BigDecimal initialTemperature = BigDecimal.valueOf(20 + Math.random() * 2).setScale(2, RoundingMode.HALF_UP);
        newPond.setTemperature(initialTemperature);
        BigDecimal initialPH = BigDecimal.valueOf(6.8 + Math.random() * 0.2).setScale(2, RoundingMode.HALF_UP);
        newPond.setPH(initialPH);
        BigDecimal initialOxygen = BigDecimal.valueOf(5 + Math.random()).setScale(2, RoundingMode.HALF_UP);
        newPond.setOxygen(initialOxygen);
        int waterQuality = PondFormula.getWaterQualityScore(initialPH, initialTemperature, initialOxygen);
        newPond.setWaterQuality(waterQuality);
        newPond.setDescription(buyPondRequestDTO.getDescription());

        Pond savedPond = this.pondRepository.save(newPond);

        // Deduct owner's wallet balance
        walletService.deduct(owner.getId(), pondPrice);

        ResPondDTO result = new ResPondDTO();
        ResPondDTO.PondOwner pondOwner = new ResPondDTO.PondOwner();
        pondOwner.setId(owner.getId());
        pondOwner.setUsername(owner.getUsername());

        result.setId(savedPond.getId());
        result.setOwner(pondOwner);
        result.setName(savedPond.getName());
        result.setLevel(savedPond.getLevel());
        result.setCapacity(savedPond.getCapacity());
        result.setWaterQuality(savedPond.getWaterQuality());
        result.setTemperature(savedPond.getTemperature());
        result.setPH(savedPond.getPH());
        result.setOxygen(savedPond.getOxygen());
        result.setCreatedAt(savedPond.getCreatedAt().toInstant());
        result.setDescription(savedPond.getDescription());

        return result;
    }

    public ResPondDTO handleUpdatePond(Pond pond) {
        Pond currentPond = this.pondRepository.findById(pond.getId()).orElse(null);
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

        return convertToResPondDTO(currentPond);
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

        List<ResPondDTO> pondList = pagePond.getContent().stream().map(this::convertToResPondDTO)
                .collect(Collectors.toList());

        resultPaginationDTO.setResult(pondList);

        return resultPaginationDTO;
    }

    public ResultPaginationDTO handleFetchPondsByOwner(Integer id, Pageable pageable) {
        Page<Pond> pagePond = this.pondRepository.findAllByOwner_Id(id, pageable);
        ResultPaginationDTO resultPaginationDTO = new ResultPaginationDTO();
        ResultPaginationDTO.Meta meta = new ResultPaginationDTO.Meta();

        meta.setPage(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setTotalPages(pagePond.getTotalPages());
        meta.setTotalElements(pagePond.getTotalElements());

        resultPaginationDTO.setMeta(meta);

        List<ResPondDTO> pondList = pagePond.getContent().stream().map(this::convertToResPondDTO)
                .collect(Collectors.toList());

        resultPaginationDTO.setResult(pondList);

        return resultPaginationDTO;
    }

    public void handleDeletePond(Integer id) {
        this.pondRepository.deleteById(id);
    }

    public boolean isPondExistById(Integer id) {
        return this.pondRepository.existsById(id);
    }

    public ResPondDTO convertToResPondDTO(Pond pond) {
        if (pond == null) {
            return null;
        }

        ResPondDTO result = new ResPondDTO();
        ResPondDTO.PondOwner pondOwner = new ResPondDTO.PondOwner();
        pondOwner.setId(pond.getOwner().getId());
        pondOwner.setUsername(pond.getOwner().getUsername());

        result.setId(pond.getId());
        result.setOwner(pondOwner);
        result.setName(pond.getName());
        result.setLevel(pond.getLevel());
        result.setCapacity(pond.getCapacity());
        result.setWaterQuality(pond.getWaterQuality());
        result.setTemperature(pond.getTemperature());
        result.setPH(pond.getPH());
        result.setOxygen(pond.getOxygen());
        result.setCreatedAt(pond.getCreatedAt().toInstant());
        result.setDescription(pond.getDescription());

        return result;

    }
}
