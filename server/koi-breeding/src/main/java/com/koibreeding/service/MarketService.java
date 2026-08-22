package com.koibreeding.service;

import com.koibreeding.domain.Dictionary;
import com.koibreeding.domain.Koi;
import com.koibreeding.domain.Marketplace;
import com.koibreeding.domain.Variety;
import com.koibreeding.dto.request.MarketRequest;
import com.koibreeding.dto.response.ResMarketDto;
import com.koibreeding.repository.MarketRepository;
import jakarta.persistence.criteria.Join;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MarketService {

    private final MarketRepository marketRepository;

    public List<ResMarketDto> getMarketItems() {
        return marketRepository.findAll().stream()
                .map(marketplace -> new ResMarketDto(
                        marketplace.getId(),
                        marketplace.getKoi().getName(),
                        marketplace.getKoi().getId(),
                        marketplace.getKoi().getName(),
                        marketplace.getKoi().getPrice(),
                        marketplace.getPrice(),
                        marketplace.getDescription(),
                        marketplace.getSeller().getUsername(),
                        marketplace.getKoi().getGender(),
                        marketplace.getKoi().getWeight(),
                        marketplace.getKoi().getLength()
                ))
                .toList();
    }

    public List<ResMarketDto> filterMarketplace(
            String keyword,
            String category,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            String size,
            String weight,
            String gender
    ) {

        Specification<Marketplace> spec =
                (root, query, cb) -> cb.conjunction();

        // Chỉ lấy tin đang ACTIVE
        spec = spec.and((root, query, cb) ->
                cb.equal(root.get("status"), "ACTIVE") // tương đương query where status = 'ACTIVE'
        );

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

        if (size != null && !size.equals("ALL")) {

            spec = spec.and((root, query, cb) -> {

                Join<Marketplace, Koi> koi =
                        root.join("koi");

                return switch (size) {

                    case "SMALL" ->
                            cb.lessThan(
                                    koi.get("length"),
                                    new BigDecimal("20")
                            );

                    case "MEDIUM" ->
                            cb.between(
                                    koi.get("length"),
                                    new BigDecimal("20"),
                                    new BigDecimal("40")
                            );

                    case "LARGE" ->
                            cb.greaterThan(
                                    koi.get("length"),
                                    new BigDecimal("40")
                            );

                    default ->
                            cb.conjunction();
                };
            });
        }

        if (weight != null && !weight.equals("ALL")) {

            spec = spec.and((root, query, cb) -> {

                Join<Marketplace, Koi> koi =
                        root.join("koi");

                return switch (weight) {

                    case "SMALL" ->
                            cb.lessThan(
                                    koi.get("weight"),
                                    new BigDecimal("1")
                            );

                    case "MEDIUM" ->
                            cb.between(
                                    koi.get("weight"),
                                    new BigDecimal("1"),
                                    new BigDecimal("3")
                            );

                    case "LARGE" ->
                            cb.greaterThan(
                                    koi.get("weight"),
                                    new BigDecimal("3")
                            );

                    default ->
                            cb.conjunction();
                };
            });
        }

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

        return marketRepository.findAll(spec)
                .stream()
                .map(marketplace -> new ResMarketDto(
                        marketplace.getId(),
                        marketplace.getKoi().getName(),
                        marketplace.getKoi().getId(),
                        marketplace.getKoi().getName(),
                        marketplace.getKoi().getPrice(),
                        marketplace.getPrice(),
                        marketplace.getDescription(),
                        marketplace.getSeller().getUsername(),
                        marketplace.getKoi().getGender(),
                        marketplace.getKoi().getWeight(),
                        marketplace.getKoi().getLength()
                ))
                .toList();
    }

}
