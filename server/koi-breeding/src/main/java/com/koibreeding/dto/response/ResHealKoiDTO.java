package com.koibreeding.dto.response;

public record ResHealKoiDTO(ResKoiDTO koi, int healthRestored, int itemsUsed, int remainingItemQuantity) {
}
