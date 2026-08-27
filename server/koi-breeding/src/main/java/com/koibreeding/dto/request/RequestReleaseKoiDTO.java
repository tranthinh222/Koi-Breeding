package com.koibreeding.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestReleaseKoiDTO {
    private Integer pondId;
    private Integer inventoryId;
    private Integer quantity;
}
