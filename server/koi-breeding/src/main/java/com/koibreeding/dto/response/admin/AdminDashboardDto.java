package com.koibreeding.dto.response.admin;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardDto {
    private MetricDto users;
    private MetricDto shopPurchases;
    private MetricDto marketplaceTrades;
    private List<RankingUserDto> topUsers;
    private RankingUserDto highestLevelUser;
    private List<TopTransactionDto> topTransactions;

    // Thêm 4 list này vào phần khai báo biến của AdminDashboardDto
    private List<TimeSeriesPointDto> userGrowthChart;
    private List<LocationPointDto> locationChart;
    private List<LifeStagePointDto> koiLifeStageChart;
    private List<MarketplacePointDto> marketplaceChart;

    // --- CÁC CLASS DTO CON ---
    @Getter 
    @Setter 
    @Builder 
    @NoArgsConstructor 
    @AllArgsConstructor
    public static class TimeSeriesPointDto {
        private String label; // Ví dụ: "Tháng 1", "Tháng 2"
        private Long value;   // Số lượng user
    }

    @Getter 
    @Setter 
    @Builder 
    @NoArgsConstructor 
    @AllArgsConstructor
    public static class LocationPointDto {
        private String location; // "HANOI", "HO_CHI_MINH_CITY"
        private Long users;      // Số user ở vị trí đó
    }

    @Getter 
    @Setter 
    @Builder 
    @NoArgsConstructor 
    @AllArgsConstructor
    public static class LifeStagePointDto {
        private String stage;    // "EGG", "FRY", "ADULT"
        private Long count;      // Số cá
    }

    @Getter 
    @Setter 
    @Builder 
    @NoArgsConstructor 
    @AllArgsConstructor
    public static class MarketplacePointDto {
        private String date;     // "01/09", "02/09"
        private Long active;
        private Long sold;
        private Long cancelled;
    }
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MetricDto {
        private long total;
        private long currentMonth;
        private long previousMonth;
        private long delta;
        private Double growthPercent;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RankingUserDto {
        private Integer id;
        private String username;
        private String avatarUrl;
        private Integer exp;
        private Integer level;
    }

    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopTransactionDto {
        private String source;
        private Integer id;
        private String title;
        private BigDecimal amount;
        private String description;
        private OffsetDateTime createdAt;
    }
}