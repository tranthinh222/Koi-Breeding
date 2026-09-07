package com.koibreeding.dto.request;

import jakarta.validation.constraints.Min;

public record UsePondItemRequest(@Min(1) Integer quantity) {
}
