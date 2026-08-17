package com.koibreeding.domain.response.home;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PondSummary {
    private Integer id;
    private String name;
    private Integer level;
    private Integer currentKoi; //Tổng số cá Koi
    private Integer capacity;
    private Integer waterQuality;
}
