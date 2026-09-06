package com.koibreeding.seeder;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.context.annotation.Profile;

import com.koibreeding.domain.User;
import com.koibreeding.domain.Wallet;
import com.koibreeding.repository.UserRepository;
import com.koibreeding.repository.WalletRepository;

@Component
@Profile("!test")
@Order(6)
public class WalletSeeder implements CommandLineRunner {
    private WalletRepository walletRepository;
    private UserRepository userRepository;

    public WalletSeeder(WalletRepository walletRepository, UserRepository userRepository) {
        this.walletRepository = walletRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (walletRepository.count() > 0) {
            System.out.println(">>> Wallets already exist");
            return;
        }

        List<String> defaultUsers = new ArrayList<>();
        for (int i = 1; i <= 5; ++i) {
            defaultUsers.add("admin" + i);
            defaultUsers.add("player" + i);
        }

        List<User> existingUserList = userRepository.findAll().stream()
                .filter(user -> defaultUsers.contains(user.getUsername())).collect(Collectors.toList());

        for (User user : existingUserList) {
            Wallet wallet = new Wallet();
            wallet.setUser(user);
            wallet.setBalance(BigDecimal.valueOf(1000));

            walletRepository.save(wallet);
        }

        System.out.println(">>> Seeded Wallets");
    }

}
