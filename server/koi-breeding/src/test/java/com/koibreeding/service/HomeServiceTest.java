package com.koibreeding.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

import java.lang.reflect.Proxy;
import java.util.List;

import org.junit.jupiter.api.Test;

import com.koibreeding.domain.Koi;
import com.koibreeding.domain.response.home.HomeResponse;
import com.koibreeding.repository.KoiRepository;

class HomeServiceTest {

    @Test
    void shouldLoadFeaturedKoiSummaryFromKoiEntities() {
        Koi koi = new Koi();
        koi.setId(10);
        koi.setName("Sakura");
        koi.setHealth(92);
        koi.setPrice(2500);

        KoiRepository koiRepository = (KoiRepository) Proxy.newProxyInstance(
                KoiRepository.class.getClassLoader(),
                new Class<?>[] { KoiRepository.class },
                (proxy, method, args) -> {
                    if (method.getName().equals("findTop3ByOrderByIdDesc")) {
                        return List.of(koi);
                    }
                    return null;
                });

        HomeService homeService = new HomeService(koiRepository);
        HomeResponse response = homeService.getHome();

        assertFalse(response.getFeaturedKoi().isEmpty());
        assertEquals(1, response.getFeaturedKoi().size());
        assertEquals(10, response.getFeaturedKoi().get(0).getId());
        assertEquals("Sakura", response.getFeaturedKoi().get(0).getName());
        assertEquals(92, response.getFeaturedKoi().get(0).getHealth());
        assertEquals(2500, response.getFeaturedKoi().get(0).getPrice());
    }
}
