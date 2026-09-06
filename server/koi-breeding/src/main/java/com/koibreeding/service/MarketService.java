package com.koibreeding.service;

import com.koibreeding.domain.*;
import com.koibreeding.dto.request.*;
import com.koibreeding.dto.response.ResMarketDto;
import com.koibreeding.dto.response.ResTradeDto;
import com.koibreeding.repository.KoiRepository;
import com.koibreeding.repository.MarketRepository;
import com.koibreeding.repository.PondRepository;
import com.koibreeding.repository.UserRepository;
import jakarta.persistence.criteria.Join;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MarketService {

    private final MarketRepository marketRepository;
    private final KoiRepository koiRepository;
    private final WalletService walletService;
    private final UserRepository userRepository;
    private final PondRepository pondRepository;
    public List<ResMarketDto> getMarketItems() {
        return marketRepository.findAll().stream()
                .map(marketplace -> new ResMarketDto(
                        marketplace.getId(),
                        marketplace.getKoi().getName(),
                        marketplace.getKoi().getId(),
                        marketplace.getKoi().getName(),
                        marketplace.getPrice(),
                        marketplace.getDescription(),
                        marketplace.getSeller().getId(),
                        marketplace.getSeller().getUsername(),
                        marketplace.getKoi().getGender(),
                        marketplace.getKoi().getWeight(),
                        marketplace.getKoi().getLength()
                ))
                .toList();
    }

    public Page<ResMarketDto> filterMarketplace(
            String keyword,
            String category,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            BigDecimal minLength,
            BigDecimal maxLength,
            BigDecimal minWeight,
            BigDecimal maxWeight,
            String gender,
            Pageable pageable
    ) {

        Specification<Marketplace> spec =
                (root, query, cb) -> cb.conjunction();

        // Chỉ lấy tin đang ACTIVE
        spec = spec.and((root, query, cb) ->
                cb.equal(root.get("status"), "ACTIVE")
        );

        // Keyword search trong Koi name và Variety name
        if (keyword != null && !keyword.isBlank()) {

            String search = "%" + keyword.trim().toLowerCase() + "%";

            spec = spec.and((root, query, cb) -> {

                Join<Marketplace, Koi> koi =
                        root.join("koi");

                Join<Koi, Dictionary> dictionary =
                        koi.join("dictionary");

                Join<Dictionary, Variety> variety =
                        dictionary.join("variety");

                return cb.or(
                        cb.like(
                                cb.lower(koi.get("name")),
                                search
                        ),
                        cb.like(
                                cb.lower(variety.get("name")),
                                search
                        )
                );
            });
        }

        // Category filter - match với variety name
        if (category != null && !category.equals("ALL")) {

            String varietyName = switch (category) {
                case "KOHAKU" -> "Kohaku";
                case "SHOWA" -> "Showa Sanshoku";
                case "OGON" -> "Ogon";
                default -> category;
            };

            spec = spec.and((root, query, cb) -> {

                Join<Marketplace, Koi> koi =
                        root.join("koi");

                Join<Koi, Dictionary> dictionary =
                        koi.join("dictionary");

                Join<Dictionary, Variety> variety =
                        dictionary.join("variety");

                return cb.equal(
                        variety.get("name"),
                        varietyName
                );
            });
        }

        // Price range filter
        if (minPrice != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(
                            root.get("price"),
                            minPrice
                    )
            );
        }

        if (maxPrice != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(
                            root.get("price"),
                            maxPrice
                    )
            );
        }

        // Length range filter (cm)
        if (minLength != null) {
            spec = spec.and((root, query, cb) -> {
                Join<Marketplace, Koi> koi = root.join("koi");
                return cb.greaterThanOrEqualTo(
                        koi.get("length"),
                        minLength
                );
            });
        }

        if (maxLength != null) {
            spec = spec.and((root, query, cb) -> {
                Join<Marketplace, Koi> koi = root.join("koi");
                return cb.lessThanOrEqualTo(
                        koi.get("length"),
                        maxLength
                );
            });
        }

        // Weight range filter (kg)
        if (minWeight != null) {
            spec = spec.and((root, query, cb) -> {
                Join<Marketplace, Koi> koi = root.join("koi");
                return cb.greaterThanOrEqualTo(
                        koi.get("weight"),
                        minWeight
                );
            });
        }

        if (maxWeight != null) {
            spec = spec.and((root, query, cb) -> {
                Join<Marketplace, Koi> koi = root.join("koi");
                return cb.lessThanOrEqualTo(
                        koi.get("weight"),
                        maxWeight
                );
            });
        }

        // Gender filter
        if (gender != null && !gender.equals("ALL")) {

            spec = spec.and((root, query, cb) -> {

                Join<Marketplace, Koi> koi =
                        root.join("koi");

                return cb.equal(
                        koi.get("gender"),
                        gender
                );
            });
        }

        return marketRepository.findAll(spec, pageable)
                .map(marketplace -> new ResMarketDto(
                        marketplace.getId(),
                        marketplace.getKoi().getName(),
                        marketplace.getKoi().getId(),
                        marketplace.getKoi().getName(),
                        marketplace.getPrice(),
                        marketplace.getDescription(),
                        marketplace.getSeller().getId(),
                        marketplace.getSeller().getUsername(),
                        marketplace.getKoi().getGender(),
                        marketplace.getKoi().getWeight(),
                        marketplace.getKoi().getLength()
                ));
    }

    public List<ResMarketListKoi> getMarketListKois(Integer userId){
        List<Koi> listKoi = koiRepository.findAvailableKoisByUserId(userId);

        if(listKoi.isEmpty()){
            throw new RuntimeException("Your pond has not fish");
        }

        return listKoi.stream()
                .map(koi -> new ResMarketListKoi(
                        koi.getId(),
                        koi.getPond().getId(),
                        koi.getName(),
                        koi.getName(),
                        koi.getGender(),
                        koi.getWeight(),
                        koi.getLength(),
                        koi.getName()
                        )
                ).toList();
    }

    public List<ResMarketKois> getMarketListBuyKois(Integer userId){
        List<Marketplace> marketKois = marketRepository.findBySellerId(userId);
        if(marketKois == null) {
            throw new RuntimeException("Your pond has not fish");
        }
        return marketKois.stream()
                .map(marketplace -> new ResMarketKois(
                        marketplace.getKoi().getId(),
                        marketplace.getKoi().getPond().getId(),
                        marketplace.getKoi().getName(),
                        marketplace.getKoi().getName(),
                        marketplace.getKoi().getGender(),
                        marketplace.getKoi().getWeight(),
                        marketplace.getKoi().getLength(),
                        marketplace.getKoi().getName(),
                        marketplace.getPrice()
                        )
                ).toList();
    }

    public ResMarketDto sellKoi(Integer userId, ResMarketSellKoi request){
        Koi koi = koiRepository.findById(request.getKoiId()).orElse(null);
        if(!koi.getPond().getOwner().getId().equals(userId)){
            throw new RuntimeException("Not find your koi fish");
        }

        if (request.getPrice() == null ||
                request.getPrice() <= 0) {

            throw new RuntimeException(
                    "The selling price must be greater than 0."
            );
        }

        Marketplace marketplace = new Marketplace();
        marketplace.setKoi(koi);
        marketplace.setSeller(koi.getPond().getOwner());
        marketplace.setPrice(request.getPrice());

        Marketplace marketplaceNew = marketRepository.save(marketplace);
        return new ResMarketDto(
                marketplaceNew.getId(),
                marketplaceNew.getKoi().getName(),
                marketplaceNew.getKoi().getId(),
                marketplaceNew.getKoi().getName(),
                marketplaceNew.getPrice(),
                marketplaceNew.getDescription(),
                marketplace.getSeller().getId(),
                marketplaceNew.getSeller().getUsername(),
                marketplaceNew.getKoi().getGender(),
                marketplaceNew.getKoi().getWeight(),
                marketplaceNew.getKoi().getLength()
        );
    }

    public void deleteKoi(ReqMarketDeleteKoi request){
        Marketplace marketplace = marketRepository.findBySellerIdAndKoiId(request.getUserId(), request.getKoiId())
                .orElseThrow(() -> new RuntimeException("Not found koi in marketplace"));

        marketRepository.delete(marketplace);
    }

    @Transactional
    public ResTradeDto buyKoi(Integer userId, ReqBuyKoi request) {

        Marketplace marketplace =
                marketRepository
                        .findBySellerIdAndKoiId(
                                request.getSellerId(),
                                request.getKoiId()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Koi not found in marketplace"
                                )
                        );

        if (request.getSellerId().equals(userId)) {
            throw new RuntimeException(
                    "You are not allowed to buy fish from yourself."
            );
        }

        if (marketplace.getPrice().compareTo(request.getPrice()) != 0) {
            throw new RuntimeException("Invalid price");
        }

        User seller = userRepository.findById(request.getSellerId()).orElse(null);

        User buyer = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        Koi koi = koiRepository.findById(request.getKoiId())
                .orElseThrow(() ->
                        new RuntimeException("Koi not found")
                );

        Pond pond = pondRepository.findById(request.getPondId())
                .orElseThrow(() ->
                        new RuntimeException("Pond not found")
                );

        if (!pond.getOwner().getId().equals(userId)) {
            throw new RuntimeException(
                    "Pond does not belong to buyer"
            );
        }

        long currentKoi =
                koiRepository.countByPond_Id(pond.getId());

        if (currentKoi >= pond.getCapacity()) {
            throw new RuntimeException("Pond is full");
        }

        walletService.deduct(
                userId,
                BigDecimal.valueOf(marketplace.getPrice())
        );

        walletService.credit(
                seller.getId(),
                BigDecimal.valueOf(marketplace.getPrice())
        );

        pond.setOwner(buyer);
        pondRepository.save(pond);

        koi.setPond(pond);

        koiRepository.save(koi);


        marketRepository.delete(marketplace);

        Trade trade = new Trade();
        trade.setSeller(seller);
        trade.setBuyer(buyer);
        trade.setListing(marketplace);
        trade.setPrice(request.getPrice());
        trade.setTradeAt(OffsetDateTime.now());

        return new ResTradeDto(
                marketplace.getId(),
                buyer.getId(),
                seller.getId(),
                marketplace.getPrice(),
                trade.getTradeAt()
        );
    }

}