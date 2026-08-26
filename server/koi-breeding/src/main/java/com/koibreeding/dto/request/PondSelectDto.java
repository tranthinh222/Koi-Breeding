package com.koibreeding.dto.request;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PondSelectDto {
    private Integer id;
    private String name;
    private Integer capacity;
    private Long currentKoi;
}
