package com.koibreeding.seeder;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.koibreeding.domain.Notification;
import com.koibreeding.domain.User;
import com.koibreeding.enums.NotificationType;
import com.koibreeding.repository.NotificationRepository;
import com.koibreeding.repository.UserRepository;

@Component
@Order(10)
public class NotificationSeeder implements CommandLineRunner {
    private NotificationRepository notificationRepository;
    private UserRepository userRepository;

    public NotificationSeeder(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (notificationRepository.count() > 0) {
            System.out.println(">>> Notifications already exist");
            return;
        }

        List<String> defaultUsers = new ArrayList<>();
        for (int i = 1; i <= 5; ++i) {
            defaultUsers.add("admin" + i);
            defaultUsers.add("player" + i);
        }

        List<User> existingUserList = userRepository.findAll().stream()
                .filter(user -> defaultUsers.contains(user.getUsername())).collect(Collectors.toList());

        List<Notification> seededNotifications = List.of(
                notification(NotificationType.DEPOSIT_SUCCESS, "Koins added", "750 Koins were added to your wallet"),
                notification(NotificationType.PURCHASE_SUCCESS, "Purchase successful", "Bought 1 Koi - Kohaku"),
                notification(NotificationType.PURCHASE_SUCCESS, "Purchase successful", "Bought 2 Koi - Yamato Nishiki"),
                notification(NotificationType.PURCHASE_SUCCESS, "Purchase successful", "Bought 3 Koi - Showa Sanshoku"),
                notification(NotificationType.PURCHASE_SUCCESS, "Purchase successful",
                        "Bought 10 Koi Food - Aqua Master"),
                notification(NotificationType.PURCHASE_SUCCESS, "Purchase successful", "Bought 5 Koi Food - Bethech"),
                notification(NotificationType.PURCHASE_SUCCESS, "Purchase successful",
                        "Bought 3 Health Elixir - KAFKA"),
                notification(NotificationType.PURCHASE_SUCCESS, "Purchase successful",
                        "Bought 4 Environment Elixir - KMnO4"));

        List<Notification> notificationsToSave = new ArrayList<>();

        for (User user : existingUserList) {
            for (Notification template : seededNotifications) {
                notificationsToSave.add(cloneNotificationForUser(template, user));
            }
        }

        notificationRepository.saveAll(notificationsToSave);
        System.out.println(">>> Seeded Notifications Successfully");
    }

    public Notification notification(NotificationType type, String title, String message) {
        Notification notification = new Notification();
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);

        return notification;
    }

    public Notification cloneNotificationForUser(Notification template, User user) {
        Notification clonedNotification = new Notification();
        clonedNotification.setUser(user);
        clonedNotification.setType(template.getType());
        clonedNotification.setTitle(template.getTitle());
        clonedNotification.setMessage(template.getMessage());

        return clonedNotification;
    }

}
