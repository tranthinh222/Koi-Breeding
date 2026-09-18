package com.koibreeding.service;

import java.time.OffsetDateTime;
import com.koibreeding.repository.KoiRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class KoiCareScheduler {
    private final KoiRepository koiRepository;
    private final KoiCareService careService;

    @Scheduled(fixedDelayString = "${app.koi.care.check-ms:60000}")
    public void updateKois() {
        OffsetDateTime now = OffsetDateTime.now();
        for (Integer id : koiRepository.findAllIds()) {
            try {
                careService.updateKoi(id, now);
            } catch (RuntimeException ex) {
                log.error("Failed to update health for koi {}", id, ex);
            }
        }
    }
}
