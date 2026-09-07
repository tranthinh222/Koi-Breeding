package com.koibreeding.enums;

import java.math.BigDecimal;

import lombok.Getter;

@Getter
public enum Location {
    HANOI("21.0285", "105.8542"),
    HO_CHI_MINH_CITY("10.8231", "106.6297"),
    DA_NANG("16.0544", "108.2022"),
    HAI_PHONG("20.8449", "106.6881"),
    CAN_THO("10.0452", "105.7469"),
    HUE("16.4637", "107.5909"),
    NHA_TRANG("12.2388", "109.1967"),
    DA_LAT("11.9404", "108.4583"),
    VUNG_TAU("10.4114", "107.1362"),
    BIEN_HOA("10.9574", "106.8427"),
    QUY_NHON("13.7820", "109.2190"),
    BUON_MA_THUOT("12.6667", "108.0500");

    private final BigDecimal latitude;
    private final BigDecimal longitude;

    Location(String latitude, String longitude) {
        this.latitude = new BigDecimal(latitude);
        this.longitude = new BigDecimal(longitude);
    }
}
