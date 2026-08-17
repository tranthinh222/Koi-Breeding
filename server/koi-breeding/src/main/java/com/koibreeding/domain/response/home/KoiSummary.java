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
public class KoiSummary {
    private Integer id;
    private String name;
    private String imageUrl;
    private Integer health;
    private Integer price;
}
