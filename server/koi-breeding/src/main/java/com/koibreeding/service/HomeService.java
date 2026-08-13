package com.koibreeding.service;
import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.koibreeding.domain.Koi;
import com.koibreeding.domain.Pond;
import com.koibreeding.domain.User;
import com.koibreeding.domain.Wallet;
import com.koibreeding.domain.response.home.HomeResponse;
import com.koibreeding.domain.response.home.KoiSummary;
import com.koibreeding.domain.response.home.PondSummary;
import com.koibreeding.domain.response.home.UserSummary;
import com.koibreeding.domain.response.home.WalletSummary;
import com.koibreeding.repository.KoiRepository;
import com.koibreeding.repository.PondRepository;
import com.koibreeding.repository.UserRepository;
import com.koibreeding.repository.WalletRepository;

@Service
public class HomeService {
    private final KoiRepository koiRepository;
    private final UserRepository userRepository;
    private final PondRepository pondRepository;
    private final WalletRepository walletRepository;

    public HomeService(
            KoiRepository koiRepository,
            UserRepository userRepository,
            PondRepository pondRepository,
            WalletRepository walletRepository) {
        this.koiRepository = koiRepository;
        this.userRepository = userRepository;
        this.pondRepository = pondRepository;
        this.walletRepository = walletRepository;
    }

    public HomeResponse getHome(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User with id '" + userId + "' is not exist."));

        Pond pond = pondRepository.findFirstByOwner_IdOrderByIdAsc(userId).orElse(null);
        Wallet wallet = walletRepository.findByUser_Id(userId).orElse(null);

        List<KoiSummary> featuredKoi = koiRepository.findTop3ByPond_Owner_IdOrderByIdDesc(userId)
                .stream()
                .map(this::toKoiSummary)
                .toList();

        return HomeResponse.builder()
                .user(toUserSummary(user))
                .wallet(toWalletSummary(wallet))
                .pond(toPondSummary(pond))
                .featuredKoi(featuredKoi)
                .build();
    }

    private UserSummary toUserSummary(User user) {
        return UserSummary.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .exp(user.getExp())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }

    private WalletSummary toWalletSummary(Wallet wallet) {
        return WalletSummary.builder()
                .balance(wallet != null ? wallet.getBalance() : BigDecimal.ZERO)
                .build();
    }

    private PondSummary toPondSummary(Pond pond) {
        if (pond == null) {
            return null;
        }

        return PondSummary.builder()
                .id(pond.getId())
                .name(pond.getName())
                .level(pond.getLevel())
                .currentKoi((int) koiRepository.countByPond_Id(pond.getId()))
                .capacity(pond.getCapacity())
                .waterQuality(pond.getWaterQuality())
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
