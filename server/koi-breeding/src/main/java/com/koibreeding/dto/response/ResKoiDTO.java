package com.koibreeding.dto.response;

import java.math.BigDecimal;
import java.time.Instant;

import com.koibreeding.domain.Dictionary;
import com.koibreeding.enums.Gender;
import com.koibreeding.enums.LifeStage;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResKoiDTO {
    private Integer id;
    private String name;
    private Integer age;
    private BigDecimal length;
    private BigDecimal weight;
    private Integer health;
    private Integer foodBar;
    private Gender gender;
    private Integer price;
    private KoiMutation mutation;
    private Instant bornedAt;
    private Integer pondId;
    private LifeStage lifeStage;
    private KoiParent father;
    private KoiParent mother;
    private BigDecimal potential;
    private Dictionary dictionary;
    private Integer patternScore;
    private Integer colorScore;
    private Integer bodyScore;
    private Integer skinScore;
    private Integer scaleScore;

    @Getter
    @Setter
    public static class KoiMutation {
        private Integer id;
        private String name;
    }

    @Getter
    @Setter
    public static class KoiParent {
        private Integer id;
        private String name;
        private String imageUrl;
        private boolean isBelongToUser;
    }
}
