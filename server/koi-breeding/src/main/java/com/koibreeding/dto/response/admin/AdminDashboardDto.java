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