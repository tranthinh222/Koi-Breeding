package com.koibreeding.service;
import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.koibreeding.domain.Koi;
import com.koibreeding.domain.response.home.HomeResponse;
import com.koibreeding.domain.response.home.KoiSummary;
import com.koibreeding.domain.response.home.PondSummary;
import com.koibreeding.domain.response.home.UserSummary;
import com.koibreeding.domain.response.home.WalletSummary;
import com.koibreeding.repository.KoiRepository;

@Service
public class HomeService {
    private final KoiRepository koiRepository;

    public HomeService(KoiRepository koiRepository) {
        this.koiRepository = koiRepository;
    }

    public HomeResponse getHome() {
        UserSummary user = UserSummary.builder()
                .id(1)
                .username("phuoc")
                .email("phuoc@example.com")
                .exp(120)
                .avatarUrl("/uploads/avatar.png")
                .build();

        PondSummary pond = PondSummary.builder()
                .id(1)
                .name("pond")
                .level(1)
                .currentKoi(0)
                .capacity(1)
                .waterQuality(0)
                .build();

        List<KoiSummary> featuredKoi = koiRepository.findTop3ByOrderByIdDesc()
                .stream()
                .map(this::toKoiSummary)
                .toList();

        WalletSummary wallet = WalletSummary.builder()
                .balance(BigDecimal.valueOf(5000))
                .build();

        return HomeResponse.builder()
                .user(user)
                .wallet(wallet)
                .pond(pond)
                .featuredKoi(featuredKoi)
                .build();
    }

    private KoiSummary toKoiSummary(Koi koi) {
        if (koi == null) {
            return null;
        }

        return KoiSummary.builder()
                .id(koi.getId())
                .name(koi.getName())
                .imageUrl("")
                .health(koi.getHealth())
                .price(koi.getPrice())
                .build();
    }
}