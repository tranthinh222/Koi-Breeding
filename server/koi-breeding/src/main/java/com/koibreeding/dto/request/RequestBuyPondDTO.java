package com.koibreeding.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestBuyPondDTO {
    private String name;
    private String description;
    private Integer price;

    private Integer ownerId;
}
