package com.koibreeding.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import java.lang.reflect.Proxy;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;

import com.koibreeding.domain.Koi;
import com.koibreeding.domain.Pond;
import com.koibreeding.domain.User;
import com.koibreeding.domain.Wallet;
import com.koibreeding.domain.response.home.HomeResponse;
import com.koibreeding.repository.KoiRepository;
import com.koibreeding.repository.PondRepository;
import com.koibreeding.repository.UserRepository;
import com.koibreeding.repository.WalletRepository;

class HomeServiceTest {

    @Test
    void shouldLoadFeaturedKoiSummaryFromKoiEntities() {
        Koi koi = new Koi();
        koi.setId(10);
        koi.setName("Sakura");
        koi.setHealth(92);
        koi.setPrice(2500);

        User user = new User();
        user.setId(1);
        user.setUsername("phuoc");
        user.setEmail("phuoc@example.com");
        user.setExp(120);
        user.setAvatarUrl("/uploads/avatar.png");

        Pond pond = new Pond();
        pond.setId(5);
        pond.setName("Main pond");
        pond.setOwner(user);
        pond.setLevel(2);
        pond.setCapacity(10);
        pond.setWaterQuality(88);

        Wallet wallet = new Wallet();
        wallet.setUser(user);
        wallet.setBalance(BigDecimal.valueOf(5000));

        KoiRepository koiRepository = (KoiRepository) Proxy.newProxyInstance(
                KoiRepository.class.getClassLoader(),
                new Class<?>[] { KoiRepository.class },
                (proxy, method, args) -> {
                    if (method.getName().equals("findTop3ByPond_Owner_IdOrderByIdDesc")) {
                        return List.of(koi);
                    }
                    if (method.getName().equals("countByPond_Id")) {
                        return 1L;
                    }
                    if (method.getName().equals("toString")) {
                        return "koiRepository";
                    }
                    return null;
                });
        UserRepository userRepository = (UserRepository) Proxy.newProxyInstance(
                UserRepository.class.getClassLoader(),
                new Class<?>[] { UserRepository.class },
                (proxy, method, args) -> {
                    if (method.getName().equals("findById")) {
                        return Optional.of(user);
                    }
                    if (method.getName().equals("toString")) {
                        return "userRepository";
                    }
                    return null;
                });
        PondRepository pondRepository = (PondRepository) Proxy.newProxyInstance(
                PondRepository.class.getClassLoader(),
                new Class<?>[] { PondRepository.class },
                (proxy, method, args) -> {
                    if (method.getName().equals("findFirstByOwner_IdOrderByIdAsc")) {
                        return Optional.of(pond);
                    }
                    if (method.getName().equals("toString")) {
                        return "pondRepository";
                    }
                    return null;
                });
        WalletRepository walletRepository = (WalletRepository) Proxy.newProxyInstance(
                WalletRepository.class.getClassLoader(),
                new Class<?>[] { WalletRepository.class },
                (proxy, method, args) -> {
                    if (method.getName().equals("findByUser_Id")) {
                        return Optional.of(wallet);
                    }
                    if (method.getName().equals("toString")) {
                        return "walletRepository";
                    }
                    return null;
                });

        HomeService homeService = new HomeService(koiRepository, userRepository, pondRepository, walletRepository);
        HomeResponse response = homeService.getHome(1);

        assertEquals(1, response.getUser().getId());
        assertEquals("phuoc", response.getUser().getUsername());
        assertEquals(BigDecimal.valueOf(5000), response.getWallet().getBalance());
        assertEquals(5, response.getPond().getId());
        assertEquals(1, response.getPond().getCurrentKoi());
        assertFalse(response.getFeaturedKoi().isEmpty());
        assertEquals(1, response.getFeaturedKoi().size());
        assertEquals(10, response.getFeaturedKoi().get(0).getId());
        assertEquals("Sakura", response.getFeaturedKoi().get(0).getName());
        assertEquals(92, response.getFeaturedKoi().get(0).getHealth());
        assertEquals(2500, response.getFeaturedKoi().get(0).getPrice());
    }
}
