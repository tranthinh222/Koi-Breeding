package com.koibreeding.dto.response;

public record ResFeedKoiDTO(
        ResKoiDTO koi,
        Integer foodRestored,
        Integer itemsUsed,
        Integer remainingItemQuantity) {
}
