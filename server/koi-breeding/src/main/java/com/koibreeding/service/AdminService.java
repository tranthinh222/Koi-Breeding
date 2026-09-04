package com.koibreeding.service;

import com.koibreeding.domain.Transaction;
import com.koibreeding.domain.Trade;
import com.koibreeding.domain.User;
import com.koibreeding.dto.request.AdminModerationUserRequest;
import com.koibreeding.dto.response.admin.AdminDashboardDto;
import com.koibreeding.dto.response.admin.AdminUserDto;
import com.koibreeding.enums.PaymentStatus;
import com.koibreeding.enums.TransactionStatus;
import com.koibreeding.enums.UserStatus;
import com.koibreeding.repository.PaymentRepository;
import com.koibreeding.repository.TransactionRepository;
import com.koibreeding.repository.TradeRepository;
import com.koibreeding.repository.UserRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final TransactionRepository transactionRepository;
    private final TradeRepository tradeRepository;
    private final AdminMailService adminMailService;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public AdminUserDto handleUpdateUser(AdminModerationUserRequest request) {
        User user = userRepository.findById(request.getId()).orElseThrow(() -> new RuntimeException("User not found"));
        //Update password implement later

        UserStatus currentStatus = user.getStatus();
        UserStatus newStatus = request.getStatus();

        if (newStatus != null && newStatus != currentStatus) {
            if ((newStatus == UserStatus.BANNED || newStatus == UserStatus.ACTIVE)
                    && (request.getReason() == null || request.getReason().isBlank())) {
                throw new RuntimeException("Reason is required when banning or unbanning a user");
            }

            user.setStatus(newStatus);
            user.setIsBanned(newStatus == UserStatus.BANNED);

            if (newStatus == UserStatus.BANNED || newStatus == UserStatus.ACTIVE) {
                adminMailService.sendStatusChangedMail(user, newStatus, request.getReason());
            }
        }

        User savedUser = userRepository.save(user);
        return userService.convertToAdminUserDto(savedUser);
    }

    @Transactional
    public void handleDeleteUser(Integer id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getStatus() != UserStatus.DELETED) {
            throw new RuntimeException("Only users with DELETED status can be removed");
        }

        userRepository.delete(user);
    }

    @Transactional(readOnly = true)
    public AdminDashboardDto handleFetchDashboard(int userLimit, int transactionLimit) {
        DashboardWindow window = DashboardWindow.current();

        long totalUsers = userRepository.count();
        long currentUsers = userRepository.countByCreatedAtBetween(window.currentStartInstant(), window.currentEndInstant());
        long previousUsers = userRepository.countByCreatedAtBetween(window.previousStartInstant(), window.previousEndInstant());

        long totalShopPurchases = paymentRepository.count();
        long currentShopPurchases = paymentRepository.countByStatusAndPaidAtBetween(PaymentStatus.PAID, window.currentStartDateTime(), window.currentEndDateTime());
        long previousShopPurchases = paymentRepository.countByStatusAndPaidAtBetween(PaymentStatus.PAID, window.previousStartDateTime(), window.previousEndDateTime());

        long totalMarketplaceTrades = tradeRepository.count();
        long currentMarketplaceTrades = tradeRepository.countByTradeAtBetween(window.currentStartOffsetDateTime(), window.currentEndOffsetDateTime());
        long previousMarketplaceTrades = tradeRepository.countByTradeAtBetween(window.previousStartOffsetDateTime(), window.previousEndOffsetDateTime());

        List<AdminDashboardDto.RankingUserDto> topUsers = userRepository.findAll(PageRequest.of(
                        0,
                        Math.max(userLimit, 1),
                        Sort.by(Sort.Direction.DESC, "exp")))
                .stream()
                .map(this::toRankingUserDto)
                .toList();

        AdminDashboardDto.RankingUserDto highestLevelUser = userRepository.findAll(PageRequest.of(
                        0,
                        1,
                        Sort.by(Sort.Direction.DESC, "exp")))
                .stream()
                .findFirst()
                .map(this::toRankingUserDto)
                .orElse(null);

        List<AdminDashboardDto.TopTransactionDto> topTransactions = collectTopTransactions(transactionLimit);

        return AdminDashboardDto.builder()
                .users(buildMetricDto(totalUsers, currentUsers, previousUsers))
                .shopPurchases(buildMetricDto(totalShopPurchases, currentShopPurchases, previousShopPurchases))
                .marketplaceTrades(buildMetricDto(totalMarketplaceTrades, currentMarketplaceTrades, previousMarketplaceTrades))
                .topUsers(topUsers)
                .highestLevelUser(highestLevelUser)
                .topTransactions(topTransactions)
                .build();
    }

    private List<AdminDashboardDto.TopTransactionDto> collectTopTransactions(int limit) {
        int safeLimit = Math.max(limit, 1);

        List<AdminDashboardDto.TopTransactionDto> combined = new ArrayList<>();

        transactionRepository.findByStatusOrderByAmountDesc(TransactionStatus.SUCCESSED, PageRequest.of(0, safeLimit))
                .stream()
                .map(this::toTopTransactionDto)
                .forEach(combined::add);

        tradeRepository.findAllByOrderByPriceDesc(PageRequest.of(0, safeLimit))
                .stream()
                .map(this::toTopTransactionDto)
                .forEach(combined::add);

        return combined.stream()
                .sorted(Comparator.comparing(AdminDashboardDto.TopTransactionDto::getAmount).reversed())
                .limit(safeLimit)
                .toList();
    }

    private AdminDashboardDto.TopTransactionDto toTopTransactionDto(Transaction transaction) {
        String title = transaction.getItem() != null ? transaction.getItem().getName() : "Unknown item";
        return AdminDashboardDto.TopTransactionDto.builder()
                .source("SHOP")
                .id(transaction.getId())
                .title(title)
                .amount(transaction.getAmount())
                .description(transaction.getDescription())
                .createdAt(transaction.getCreatedAt())
                .build();
    }

    private AdminDashboardDto.TopTransactionDto toTopTransactionDto(Trade trade) {
        String title = trade.getListing() != null && trade.getListing().getKoi() != null
                ? trade.getListing().getKoi().getName()
                : "Marketplace trade";
        return AdminDashboardDto.TopTransactionDto.builder()
                .source("MARKETPLACE")
                .id(trade.getId())
                .title(title)
                .amount(BigDecimal.valueOf(trade.getPrice()))
                .description("Seller: %s, Buyer: %s".formatted(
                        trade.getSeller() != null ? trade.getSeller().getUsername() : "Unknown",
                        trade.getBuyer() != null ? trade.getBuyer().getUsername() : "Unknown"))
                .createdAt(trade.getTradeAt())
                .build();
    }

    private AdminDashboardDto.RankingUserDto toRankingUserDto(User user) {
        return AdminDashboardDto.RankingUserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .avatarUrl(user.getAvatarUrl())
                .exp(user.getExp())
                .level(getLevel(user.getExp()))
                .build();
    }

    private AdminDashboardDto.MetricDto buildMetricDto(long total, long currentMonth, long previousMonth) {
        long delta = currentMonth - previousMonth;
        Double growthPercent = previousMonth == 0 ? null : BigDecimal.valueOf(delta)
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(previousMonth), 2, RoundingMode.HALF_UP)
                .doubleValue();

        return AdminDashboardDto.MetricDto.builder()
                .total(total)
                .currentMonth(currentMonth)
                .previousMonth(previousMonth)
                .delta(delta)
                .growthPercent(growthPercent)
                .build();
    }

    private int getLevel(Integer exp) {
        if (exp == null || exp <= 0) {
            return 1;
        }

        return Math.max(1, exp / 100);
    }

    private record DashboardWindow(
            Instant currentStartInstant,
            Instant currentEndInstant,
            Instant previousStartInstant,
            Instant previousEndInstant,
            LocalDateTime currentStartDateTime,
            LocalDateTime currentEndDateTime,
            LocalDateTime previousStartDateTime,
            LocalDateTime previousEndDateTime,
            OffsetDateTime currentStartOffsetDateTime,
            OffsetDateTime currentEndOffsetDateTime,
            OffsetDateTime previousStartOffsetDateTime,
            OffsetDateTime previousEndOffsetDateTime) {

        static DashboardWindow current() {
            YearMonth nowMonth = YearMonth.now(ZoneOffset.UTC);
            YearMonth previousMonth = nowMonth.minusMonths(1);

            Instant currentStartInstant = nowMonth.atDay(1).atStartOfDay().toInstant(ZoneOffset.UTC);
            Instant currentEndInstant = Instant.now();
            Instant previousStartInstant = previousMonth.atDay(1).atStartOfDay().toInstant(ZoneOffset.UTC);
            Instant previousEndInstant = nowMonth.atDay(1).atStartOfDay().toInstant(ZoneOffset.UTC);

            LocalDateTime currentStartDateTime = nowMonth.atDay(1).atStartOfDay();
            LocalDateTime currentEndDateTime = LocalDateTime.now(ZoneOffset.UTC);
            LocalDateTime previousStartDateTime = previousMonth.atDay(1).atStartOfDay();
            LocalDateTime previousEndDateTime = nowMonth.atDay(1).atStartOfDay();

            OffsetDateTime currentStartOffsetDateTime = currentStartDateTime.atOffset(ZoneOffset.UTC);
            OffsetDateTime currentEndOffsetDateTime = OffsetDateTime.now(ZoneOffset.UTC);
            OffsetDateTime previousStartOffsetDateTime = previousStartDateTime.atOffset(ZoneOffset.UTC);
            OffsetDateTime previousEndOffsetDateTime = currentStartOffsetDateTime;

            return new DashboardWindow(
                    currentStartInstant,
                    currentEndInstant,
                    previousStartInstant,
                    previousEndInstant,
                    currentStartDateTime,
                    currentEndDateTime,
                    previousStartDateTime,
                    previousEndDateTime,
                    currentStartOffsetDateTime,
                    currentEndOffsetDateTime,
                    previousStartOffsetDateTime,
                    previousEndOffsetDateTime);
        }
    }
}