package com.koibreeding.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestMoveKoiDTO {
    private Integer targetKoiId;
    private Integer sourcePondId;
    private Integer targetPondId;
}
