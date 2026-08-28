package com.koibreeding.config;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.koibreeding.domain.Dictionary;
import com.koibreeding.domain.Inventory;
import com.koibreeding.domain.Item;
import com.koibreeding.domain.Mutation;
import com.koibreeding.domain.Notification;
import com.koibreeding.domain.Transaction;
import com.koibreeding.domain.User;
import com.koibreeding.domain.Variety;
import com.koibreeding.domain.Wallet;
import com.koibreeding.enums.EffectType;
import com.koibreeding.enums.Gender;
import com.koibreeding.enums.ItemType;
import com.koibreeding.enums.NotificationType;
import com.koibreeding.enums.Role;
import com.koibreeding.enums.ScaleType;
import com.koibreeding.enums.Shape;
import com.koibreeding.enums.TransactionStatus;
import com.koibreeding.enums.TransactionType;
import com.koibreeding.enums.UserStatus;
import com.koibreeding.repository.DictionaryRepository;
import com.koibreeding.repository.InventoryRepository;
import com.koibreeding.repository.ItemRepository;
import com.koibreeding.repository.MutationRepository;
import com.koibreeding.repository.NotificationRepository;
import com.koibreeding.repository.TransactionRepository;
import com.koibreeding.repository.UserRepository;
import com.koibreeding.repository.VarietyRepository;
import com.koibreeding.repository.WalletRepository;

@Configuration
public class SampleDataInitializer {

    @Bean
    CommandLineRunner seedSampleData(VarietyRepository varietyRepository, MutationRepository mutationRepository,
            DictionaryRepository dictionaryRepository,
            ItemRepository itemRepository,
            UserRepository userRepository,
            WalletRepository walletRepository, InventoryRepository inventoryRepository,
            TransactionRepository transactionRepository, NotificationRepository notificationRepository) {
        return args -> {

            seedVarieties(varietyRepository);
            seedMutations(mutationRepository);
            seedDictionaries(varietyRepository, dictionaryRepository);

            Map<String, Item> existingItemsByName = itemRepository.findAll().stream()
                    .collect(Collectors.toMap(Item::getName, item -> item, (left, right) -> left,
                            LinkedHashMap::new));

            List<Item> seededItems = List.of(
                    item("Koi Food - Aqua Master", "15.00", ItemType.FOOD, EffectType.GROWTH,
                            "15.00",
                            "Common food that restores 15 food points.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786628411/uploads/items/vdgmp3zgrcwy6qfaduv5.svg"),
                    item("Koi Food - Bethech", "25.00", ItemType.FOOD, EffectType.GROWTH, "30.00",
                            "Standard food that restores 30 food points.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786628498/uploads/items/jbpkxycegrmrtiywi0tq.svg"),
                    item("Koi Food - Ipick", "45.00", ItemType.FOOD, EffectType.GROWTH, "50.00",
                            "Premium food that restores 50 food points.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786628532/uploads/items/fnn7slmun7ktkkttifes.svg"),
                    item("Koi Food - Kofu", "75.00", ItemType.FOOD, EffectType.GROWTH, "90.00",
                            "Legendary food that restores 90 food points.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786628571/uploads/items/wtvx5qvpkwxcnsaj6guw.svg"),
                    item("Koi Food - Koi King", "35.00", ItemType.FOOD, EffectType.GROWTH, "40.00",
                            "A balanced daily food for healthy Koi.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786628891/uploads/items/pvsyus6qwcebvhpaxd0j.svg"),

                    item("Environment Elixir - KMnO4", "15.00", ItemType.MEDICINE,
                            EffectType.WATER_QUALITY, "15.00",
                            "Restores 15 water-quality points and helps disinfect the pond.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786628948/uploads/items/b6s6nqu3phlh79obevyc.svg"),
                    item("Environment Elixir - ORARPS", "25.00", ItemType.MEDICINE,
                            EffectType.WATER_QUALITY, "30.00",
                            "Standard treatment for pond water quality.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629001/uploads/items/esai3zntpelx0d2jdv7d.svg"),
                    item("Environment Elixir - DIMILIN", "45.00", ItemType.MEDICINE,
                            EffectType.WATER_QUALITY, "50.00",
                            "Premium water-quality treatment for a clean pond.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629031/uploads/items/nssd84q3glrt5mkz82nj.svg"),
                    item("Disease Cure - Link", "15.00", ItemType.MEDICINE,
                            EffectType.WATER_QUALITY, "10.00",
                            "Common medicine used to treat minor Koi diseases.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629083/uploads/items/ycpzocraxl4gmgordzvu.svg"),
                    item("Disease Cure - MIP", "25.00", ItemType.MEDICINE, EffectType.WATER_QUALITY,
                            "25.00",
                            "Standard medicine for treating common diseases.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629116/uploads/items/to9axfaid3gm2y4brqxv.svg"),
                    item("Disease Cure - Cloak", "45.00", ItemType.MEDICINE,
                            EffectType.WATER_QUALITY, "45.00",
                            "Premium cure for severe Koi diseases.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629140/uploads/items/qxryphcvy1acd8fijyfv.svg"),
                    item("Mutation Elixir - CLAK", "15.00", ItemType.MEDICINE, EffectType.MUTATION,
                            "5.00",
                            "Common elixir with a small mutation bonus.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629184/uploads/items/hbuwdasojzkzc4lq2lpu.svg"),
                    item("Health Elixir - KAFKA", "45.00", ItemType.MEDICINE, EffectType.GROWTH,
                            "40.00",
                            "Premium health elixir that improves Koi recovery.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629220/uploads/items/q1octogpibw1pksh2yez.svg"),

                    item("Koi - Kohaku", "100.00", ItemType.KOI, EffectType.GROWTH, "1.00",
                            "Classic white Koi with vivid red Hi markings.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629266/uploads/items/cxnccf0exmmyaf0ddf5e.svg"),
                    item("Koi - Tancho", "180.00", ItemType.KOI, EffectType.GROWTH, "1.00",
                            "Distinctive Koi with a signature red marking on its head.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629292/uploads/items/jzckhsxukfrdilmrsjrq.svg"),
                    item("Koi - Taisho Sanke", "120.00", ItemType.KOI, EffectType.GROWTH, "1.00",
                            "A graceful Koi with white, red, and black patterns.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629315/uploads/items/gi7oeh6f4h5fphewfano.svg"),

                    item("Koins Pack - 250", "25000", ItemType.CURRENCY, null, "250",
                            "Receive 250 Koins after successful payment.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786618553/uploads/items/d27v3vwzkdp1bj2cpllt.svg"),
                    item("Koins Pack - 750", "75000", ItemType.CURRENCY, null, "750",
                            "Receive 750 Koins after successful payment.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786621657/uploads/items/i2ixkywqfkon8d9dwqvg.svg"),
                    item("Koins Pack - 3000", "300000", ItemType.CURRENCY, null, "3000",
                            "Receive 3,000 Koins after successful payment.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629378/uploads/items/f5y9pbvqldhcixknvysf.svg"),
                    item("Koins Pack - 9000", "850000", ItemType.CURRENCY, null, "9000",
                            "Receive 9,000 Koins after successful payment.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629408/uploads/items/u5u9yoemfldk9ppndwbv.svg"),
                    item("Koins Pack - 25000", "2200000", ItemType.CURRENCY, null, "25000",
                            "Receive 25,000 Koins after successful payment.",
                            "https://res.cloudinary.com/djmcluh5n/image/upload/v1786629525/uploads/items/xhaaz1lvc5jqmolrqo4t.svg"));
            itemRepository.saveAll(seededItems.stream()
                    .map(seededItem -> {
                        Item existingItem = existingItemsByName.get(seededItem.getName());
                        if (existingItem == null) {
                            return seededItem;
                        }

                        existingItem.setPrice(seededItem.getPrice());
                        existingItem.setItemType(seededItem.getItemType());
                        existingItem.setEffectType(seededItem.getEffectType());
                        existingItem.setEffectValue(seededItem.getEffectValue());
                        existingItem.setUsageLimit(seededItem.getUsageLimit());
                        existingItem.setDescription(seededItem.getDescription());
                        existingItem.setItemUrl(seededItem.getItemUrl());
                        return existingItem;
                    })
                    .toList());

            Map<String, Item> itemsByName = itemRepository.findAll().stream()
                    .collect(Collectors.toMap(Item::getName, item -> item, (left, right) -> left,
                            LinkedHashMap::new));

            User demoUser = userRepository.findAll().stream()
                    .filter(user -> "demo_user".equals(user.getUsername()))
                    .findFirst()
                    .orElseGet(User::new);
            demoUser.setUsername("demo_user");
            demoUser.setEmail("demo_user@koi.local");
            demoUser.setPassword("123456");
            demoUser.setBirthday(LocalDate.of(2000, 1, 1));
            demoUser.setGender(Gender.MALE);
            demoUser.setStatus(UserStatus.ACTIVE);
            demoUser.setRole(Role.USER);
            demoUser.setIsBanned(false);
            demoUser.setExp(0);
            demoUser.setAvatarUrl(null);
            demoUser = userRepository.save(demoUser);

            Wallet wallet = walletRepository.findByUserId(demoUser.getId()).orElseGet(Wallet::new);
            wallet.setUser(demoUser);
            wallet.setBalance(new BigDecimal("1000"));
            walletRepository.save(wallet);

            User sampleUser = userRepository.findAll().stream()
                    .filter(user -> "koi_enthusiast".equals(user.getUsername()))
                    .findFirst()
                    .orElseGet(User::new);
            sampleUser.setUsername("koi_enthusiast");
            sampleUser.setEmail("koi_enthusiast@koi.local");
            sampleUser.setPassword("123456");
            sampleUser.setBirthday(LocalDate.of(1998, 6, 15));
            sampleUser.setGender(Gender.FEMALE);
            sampleUser.setStatus(UserStatus.ACTIVE);
            sampleUser.setRole(Role.USER);
            sampleUser.setIsBanned(false);
            sampleUser.setExp(250);
            sampleUser.setAvatarUrl(null);
            sampleUser = userRepository.save(sampleUser);

            Wallet sampleWallet = walletRepository.findByUserId(sampleUser.getId()).orElseGet(Wallet::new);
            sampleWallet.setUser(sampleUser);
            sampleWallet.setBalance(new BigDecimal("5000"));
            walletRepository.save(sampleWallet);

            seedInventoryRow(inventoryRepository, demoUser, itemsByName.get("Koi - Kohaku"), 1);
            seedInventoryRow(inventoryRepository, demoUser, itemsByName.get("Koi - Tancho"), 2);
            seedInventoryRow(inventoryRepository, demoUser, itemsByName.get("Koi - Taisho Sanke"), 1);
            seedInventoryRow(inventoryRepository, demoUser, itemsByName.get("Koi Food - Aqua Master"), 10);
            seedInventoryRow(inventoryRepository, demoUser, itemsByName.get("Koi Food - Bethech"), 5);
            seedInventoryRow(inventoryRepository, demoUser, itemsByName.get("Health Elixir - KAFKA"), 3);
            seedInventoryRow(inventoryRepository, demoUser, itemsByName.get("Environment Elixir - KMnO4"),
                    4);

            backfillTransactionsWithoutItem(transactionRepository,
                    itemsByName.get("Koi Food - Aqua Master"));
            seedTransactions(transactionRepository, wallet, itemsByName);
            seedNotifications(notificationRepository, demoUser);
        };
    }

    private Item item(String name, String price, ItemType itemType, EffectType effectType, String effectValue,
            String description, String itemURL) {
        Item item = new Item();
        item.setName(name);
        item.setPrice(new BigDecimal(price));
        item.setItemType(itemType);
        item.setEffectType(effectType);
        item.setEffectValue(new BigDecimal(effectValue));
        item.setUsageLimit(1);
        item.setDescription(description);
        item.setItemUrl(itemURL);
        return item;
    }

    private void seedInventoryRow(InventoryRepository inventoryRepository, User user, Item item, int quantity) {
        if (item == null) {
            return;
        }

        Inventory inventory = inventoryRepository.findByUserIdAndItemId(user.getId(), item.getId())
                .orElseGet(Inventory::new);
        inventory.setUser(user);
        inventory.setItem(item);
        inventory.setQuantity(quantity);
        inventoryRepository.save(inventory);
    }

    private void backfillTransactionsWithoutItem(TransactionRepository transactionRepository, Item fallbackItem) {
        if (fallbackItem == null) {
            return;
        }
        List<Transaction> orphanTransactions = transactionRepository.findByItemIsNull();
        orphanTransactions.forEach(transaction -> transaction.setItem(fallbackItem));
        transactionRepository.saveAll(orphanTransactions);
    }

    private void seedTransactions(TransactionRepository transactionRepository, Wallet wallet,
            Map<String, Item> itemsByName) {
        if (transactionRepository.existsByWalletUserId(wallet.getUser().getId())) {
            return;
        }

        seedTransaction(transactionRepository, wallet, itemsByName.get("Koi - Kohaku"), "100",
                TransactionType.BUY_FISH, "Bought 1 Koi - Kohaku");
        seedTransaction(transactionRepository, wallet, itemsByName.get("Koi Food - Aqua Master"), "30",
                TransactionType.BUY_FOOD, "Bought 2 Koi Food - Aqua Master");
        seedTransaction(transactionRepository, wallet, itemsByName.get("Koins Pack - 750"), "750",
                TransactionType.DEPOSIT, "Added 750 Koins from Koins Pack - 750");
    }

    private void seedTransaction(TransactionRepository transactionRepository, Wallet wallet, Item item,
            String amount,
            TransactionType type, String description) {
        if (item == null) {
            return;
        }
        Transaction transaction = new Transaction();
        transaction.setWallet(wallet);
        transaction.setItem(item);
        transaction.setAmount(new BigDecimal(amount));
        transaction.setTransactionType(type);
        transaction.setStatus(TransactionStatus.SUCCESSED);
        transaction.setDescription(description);
        transactionRepository.save(transaction);
    }

    private void seedNotifications(NotificationRepository notificationRepository, User user) {
        if (!notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).isEmpty()) {
            return;
        }
        seedNotification(notificationRepository, user, NotificationType.PURCHASE_SUCCESS, "Purchase successful",
                "Bought 1 Koi - Kohaku.");
        seedNotification(notificationRepository, user, NotificationType.DEPOSIT_SUCCESS, "Koins added",
                "750 Koins were added to your wallet.");
    }

    private void seedNotification(NotificationRepository notificationRepository, User user, NotificationType type,
            String title, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notificationRepository.save(notification);
    }

    private void seedVarieties(VarietyRepository varietyRepository) {
        Map<String, Variety> existingVarietiesByName = varietyRepository.findAll().stream()
                .filter(Objects::nonNull)
                .filter(v -> v.getName() != null)
                .collect(Collectors.toMap(
                        v -> v.getName(),
                        item -> item,
                        (left, right) -> left,
                        LinkedHashMap::new));

        varietyRepository.saveAll(SampleData.getSampleVarietyList().stream()
                .map(seededVariety -> {
                    Variety existingVariety = existingVarietiesByName.get(seededVariety.getName());
                    if (existingVariety == null) {
                        return seededVariety;
                    }

                    existingVariety.setDescription(seededVariety.getDescription());
                    return existingVariety;
                })
                .toList());
    }

    private void seedMutations(MutationRepository mutationRepository) {
        Map<String, Mutation> existingMutationsByName = mutationRepository.findAll().stream()
                .filter(Objects::nonNull)
                .filter(v -> v.getName() != null)
                .collect(Collectors.toMap(
                        v -> v.getName(),
                        item -> item,
                        (left, right) -> left,
                        LinkedHashMap::new));

        mutationRepository.saveAll(SampleData.getSampleMutationList().stream()
                .map(seededMutation -> {
                    Mutation existingMutation = existingMutationsByName.get(seededMutation.getName());
                    if (existingMutation == null) {
                        return seededMutation;
                    }

                    existingMutation.setRate(seededMutation.getRate());
                    existingMutation.setValue(seededMutation.getValue());
                    existingMutation.setDescription(seededMutation.getDescription());
                    return existingMutation;
                })
                .toList());
    }

    private void seedDictionaries(VarietyRepository varietyRepository, DictionaryRepository dictionaryRepository) {
        Map<String, Dictionary> existingDictionariesByName = dictionaryRepository.findAll().stream()
                .filter(Objects::nonNull)
                .filter(v -> v.getName() != null)
                .collect(Collectors.toMap(
                        v -> v.getName(),
                        item -> item,
                        (left, right) -> left,
                        LinkedHashMap::new));

        Map<String, Variety> currentVariety = varietyRepository.findAll().stream()
                .filter(Objects::nonNull)
                .filter(v -> v.getName() != null)
                .collect(Collectors.toMap(
                        v -> v.getName(),
                        item -> item,
                        (left, right) -> left,
                        LinkedHashMap::new));

        dictionaryRepository.saveAll(SampleData.getSampleDictionaryList().stream()
                .map(seededDictionary -> {
                    Dictionary existingDictionary = existingDictionariesByName.get(seededDictionary.getName());
                    if (existingDictionary == null) {
                        seededDictionary.setVariety(currentVariety.get(seededDictionary.getVariety().getName()));
                        return seededDictionary;
                    }

                    existingDictionary.setShape(seededDictionary.getShape());
                    existingDictionary.setScaleType(seededDictionary.getScaleType());
                    existingDictionary.setVariety(currentVariety.get(seededDictionary.getVariety().getName()));
                    existingDictionary.setOrigin(seededDictionary.getOrigin());
                    existingDictionary.setBaseMaxLength(seededDictionary.getBaseMaxLength());
                    existingDictionary.setBaseGrowthRate(seededDictionary.getBaseGrowthRate());
                    existingDictionary.setMidAge(seededDictionary.getMidAge());
                    existingDictionary.setAlphaWeight(seededDictionary.getAlphaWeight());
                    existingDictionary.setBasePrice(seededDictionary.getBasePrice());
                    existingDictionary.setAlphaPrice(seededDictionary.getAlphaPrice());
                    existingDictionary.setImageUrl(seededDictionary.getImageUrl());

                    return existingDictionary;
                })
                .toList());
    }
}

class SampleData {
    private static final List<Variety> SAMPLE_VARIETIES = List.of(
            new Variety(null, "Kohaku",
                    "Cá Koi Kohaku là giống cá Koi nổi tiếng và phổ biến nhất, dễ nhận diện nhờ sự kết hợp hài hòa giữa nền trắng tinh khôi và các mảng đỏ rực rỡ. Đây là dòng Wagoi (có vảy), với vảy ánh bạc đều đặn, tạo nên vẻ đẹp sang trọng và tinh tế.\nMột Kohaku đẹp phải có thân hình thon dài, chắc khỏe, dáng giọt nước cân đối; vây trắng tuyết dày, căng tròn, không dính đỏ; vảy đều và sáng bóng. Nền trắng phải sạch sẽ, không có đốm đen hay xỉn màu, trong khi màu đỏ đậm như ớt chín, đồng đều từ đầu đến đuôi.\nHọa tiết trên đầu không phủ qua mắt và miệng, dừng lại cách mũi một khoảng trắng (Odome), họa tiết trên thân cân đối hai bên và không chạm vào gốc đuôi, cách ít nhất 2cm để tránh lỗi thẩm mỹ Shimizushi. Kohaku được xem là “nền tảng” của nghệ thuật nuôi cá Koi, mang vẻ đẹp thanh tao nhưng mạnh mẽ, và luôn giữ vị trí đặc biệt trong mọi bộ sưu tập Koi."),
            new Variety(null, "Tancho",
                    "Cá Koi Tancho là giống cá đặc biệt và hiếm, nổi bật với chấm đỏ tròn đều nằm chính giữa đầu, cân đối giữa hai mắt. Thân cá có nền trắng tinh khiết (Shiroji), không lẫn đốm đen hay vết lem, kết hợp với chấm đỏ (Hi) rực rỡ, đậm màu như ớt chín.\nTancho đẹp phải có thân hình khỏe mạnh, thuôn dài, vây trắng tuyết dày và đối xứng, không dính đỏ hay tia máu. Dáng bơi thẳng, uyển chuyển, nhẹ nhàng, toát lên vẻ quý phái.\nĐây là giống cá mang ý nghĩa may mắn và thịnh vượng, đặc biệt được yêu thích tại Nhật Bản vì chấm đỏ trên đầu gợi liên tưởng đến quốc kỳ. Một Tancho chuẩn mực là sự kết hợp hoàn hảo giữa chấm đỏ cân đối, nền trắng tinh khôi và dáng bơi thanh thoát, tạo nên giá trị cao trong bộ sưu tập Koi."),
            new Variety(null, "Taisho Sanke",
                    "Cá Koi Taisho Sanke là giống cá phát triển từ Kohaku, nổi bật với nền trắng tinh khiết kết hợp các mảng đỏ rực rỡ và những chấm đen nhỏ sắc nét rải rác trên thân. Đây là dòng Wagoi (có vảy), mang vẻ đẹp thanh thoát và cân đối.\\nMột Sanke đẹp phải có nền trắng chiếm khoảng 50–60% diện tích, sạch sẽ nnhư men sứ; mảng đỏ chiếm 30–40%, đỏ đậm, bóng mịn với ranh giới sắc nét; chấm đen chiếm 10–20%, nhỏ gọn, bóng như mực tàu và rải đều từ vai đến đuôi. Đầu cá tuyệt đối không có màu đen, chỉ có trắng và đỏ, trong khi vây ngực lý tưởng có 2–3 tia sọc đen thẳng, vây trắng hoàn toàn cũng được chấp nhận.\\nThân hình Sanke to khỏe, vai rộng, lưng dày, dáng thuôn dài như thủy lôi, kết hợp với dáng bơi uyển chuyển, đuôi vẫy mạnh mẽ nhưng thân không lắc lư. Sự cân bằng hoàn hảo giữa ba màu trắng, đỏ và đen tạo nên vẻ đẹp sang trọng, thanh thoát và giá trị cao trong bộ sưu tập Koi."),
            new Variety(null, "Showa Sanshoku",
                    "Cá Koi Showa Sanshoku là một trong ba giống Koi kinh điển, nổi bật với nền da đen chiếm đa số kết hợp hài hòa cùng các mảng trắng tinh khiết và đỏ rực rỡ. Đây là dòng Wagoi (có vảy), mang vẻ đẹp mạnh mẽ, uy nghi và đầy quyền lực.\\nMột Showa đẹp phải có các mảng đen to rộng, sâu và bóng bẩy như mực tàu, chạy loang vệt mạnh mẽ quanh thân và vệt đen lớn trên đầu tạo hình chữ Y hoặc X, đem lại vẻ dữ dằn đặc trưng. Vây ngực có Motoguro đối xứng, chiếm khoảng một phần ba diện tích vây, phần còn lại trắng sạch sẽ. Màu đỏ phải đậm như máu hoặc ớt chín, phân bổ thành khối lớn đối xứng, trong khi nền trắng muốt như men sứ giúp cân bằng tổng thể.\\nThân hình Showa to khỏe, vai rộng, lưng dày, dáng thuôn dài như quả thủy lôi, có tiềm năng phát triển kích thước vượt trội trên 85–90cm. Dáng bơi uyển chuyển nhưng mạnh mẽ, đuôi vẫy dứt khoát, thân không lắc lư. Sự hòa quyện hoàn hảo của ba màu đen, đỏ, trắng cùng thể hình khổng lồ khiến Showa Sanshoku trở thành biểu tượng sức mạnh và viên ngọc quý trong bộ sưu tập Koi."),
            new Variety(null, "Goromo",
                    "Cá Koi Goromo là giống cá được lai chéo giữa Kohaku và Asagi, mang vẻ đẹp độc đáo và hiếm có. Nền da trắng tuyết hoặc trắng sữa tinh khiết, không pha vàng hay nhạt màu, kết hợp với các mảng đỏ thẫm đồng đều. \\nĐiểm đặc biệt của Goromo là đường viền quanh các mảng đỏ có màu xanh Indigo hoặc đen, tạo hoa văn dạng lưới như tổ ong, khiến cá trở nên nổi bật và khác biệt. Phần đầu cá càng ít mảng màu hoặc sạch sẽ không tỳ vết thì giá trị càng cao.\\nNgoài ra, các tiêu chí đánh giá khác cũng tương tự như những dòng Koi truyền thống, chú trọng vào sự cân đối của thể hình, màu sắc và dáng bơi. Goromo mang lại vẻ đẹp thanh tao nhưng vẫn mạnh mẽ, là sự kết hợp hoàn hảo giữa sự tinh khiết của Kohaku và nét huyền bí của Asagi."),
            new Variety(null, "Utsuri",
                    "Cá Koi Utsuri là dòng cá nổi bật với sự tương phản mạnh mẽ giữa màu đen tuyền sâu thẳm và một màu thứ hai như trắng, đỏ hoặc vàng. Trong đó, Shiro Utsuri truyền thống có thân đen trắng như tranh thủy mặc, còn Hi Utsuri và Ki Utsuri mang sắc đỏ hoặc vàng rực rỡ trên nền đen. Màu đen (Sumi) phải bóng bẩy như mực tàu, phân bổ thành mảng lớn, dày dặn và nổi khối nhẹ trên da, trong khi màu trắng, đỏ hoặc vàng phải tinh khiết, đậm và đồng đều.\\nHọa tiết của Utsuri thường đan xen như quân cờ hoặc chạy zigzag dọc thân, tạo sự cân đối hai bên, với vệt đen lớn trên đầu hình chữ Y hoặc X làm tăng vẻ uy nghi. Vây ngực có Motoguro đối xứng, phần còn lại sạch sẽ, là điểm nhấn đặc trưng nâng cao giá trị cá. Thân hình Utsuri to khỏe, đầu rộng, vai dày, dáng thuôn dài như thủy lôi, có tiềm năng phát triển trên 80–85cm.\\nDáng bơi uyển chuyển nhưng đầy quyền lực, đuôi vẫy mạnh mẽ mà thân không lắc lư, khiến Utsuri trở thành một trong những dòng cá Koi mang vẻ đẹp nghệ thuật và giá trị cao nhất."),
            new Variety(null, "Hikari Utsuri",
                    "Cá Koi Hikari Utsuri là nhánh nhỏ của dòng Utsuri và cũng là loại Koi kim loại đầu tiên phát triển từ Showa, đặc trưng bởi lớp vảy óng ánh kim rực rỡ.\\nĐây là dòng Wagoi (có vảy), được đánh giá chủ yếu dựa trên độ sáng bóng và óng ánh của lớp vảy kim loại, càng lấp lánh thì giá trị càng cao. Các tiêu chí khác vẫn dựa theo chuẩn của Utsuri, với sự cân đối giữa màu đen tuyền sâu thẳm và màu sắc thứ hai.\\nHikari Utsuri có ba biến thể chính: Hikari Shiro Utsuri với màu trắng đen truyền thống, Hi Utsuri với màu đỏ đen nổi bật, và Ki Utsuri với màu vàng đen hiếm gặp. Sự kết hợp giữa ánh kim độc đáo và họa tiết mạnh mẽ khiến Hikari Utsuri trở thành một trong những dòng Koi ấn tượng và giá trị cao trong bộ sưu tập."),
            new Variety(null, "Bekko",
                    "Cá Koi Bekko là dòng cá mang vẻ đẹp giản dị nhưng tinh tế, dễ nhận diện nhờ sự kết hợp giữa màu nền trắng, đỏ hoặc vàng với những đốm đen nhỏ rải rác phía trên đường bên.\\nKhác với Utsuri, hoa văn đen của Bekko nhỏ gọn, sắc nét và thường không xuất hiện trên đầu, mà phân bố dọc thân cá, so le hai bên vây lưng tạo sự cân đối. Đây là dòng Wagoi (có vảy), với vảy đục không ánh kim, mắt to, thân trong, vai và bụng tròn bầu hơn cá thường. Bekko đẹp phải có nền màu tinh khiết, đốm đen rõ ràng, không loang lổ, và hoa văn phân bổ hài hòa.\\nDòng này có ba biến thể chính: Shiro Bekko (trắng – đen), Aka Bekko (đỏ – đen), và Ki Bekko (vàng – đen). Sự đơn giản nhưng thanh thoát trong màu sắc và họa tiết khiến Bekko trở thành một trong những giống Koi được yêu thích, mang lại vẻ đẹp nhẹ nhàng và giá trị thẩm mỹ cao trong bộ sưu tập."),
            new Variety(null, "Karashi",
                    "Cá Koi Karashi là giống cá đơn sắc thuộc nhóm Kawarimono, nổi bật với toàn thân màu vàng nhạt đến vàng đậm tươi sáng, đồng đều từ đầu đến đuôi. Đây là dòng Wagoi (có vảy), đôi khi có biến thể Karashi Ginrin (vảy ánh kim) hoặc Doitsu Karashi (da trơn không vảy). Karashi được lai tạo từ Kigoi và Chagoi, nổi tiếng với khả năng phát triển kích thước khổng lồ, có thể đạt tới 80–100cm, và được ví như “người khổng lồ hiền lành” trong hồ Koi.\\nMột Karashi đẹp phải có màu vàng đồng đều, tươi sáng, không loang lổ; thân hình to khỏe, khung xương lớn, dáng thuôn dài cân đối; vảy đều và sáng bóng. Ngoài vẻ đẹp đơn giản nhưng nổi bật, Karashi còn được yêu thích bởi tính cách thân thiện, dễ gần, thường nhanh chóng làm quen với người nuôi và tạo sự cân bằng cho cả đàn Koi. Chính sự kết hợp giữa màu sắc vàng rực rỡ, kích thước vượt trội và tính cách hiền hòa đã khiến Karashi trở thành một trong những giống Koi đặc biệt giá trị trong bộ sưu tập."),
            new Variety(null, "Benigoi",
                    "Cá Koi Benigoi là giống cá đơn sắc thuộc nhóm Kawarimono, nổi bật với toàn thân màu đỏ đậm rực rỡ, vảy óng ánh đỏ và vây ngực đỏ hoàn toàn, không có chút màu trắng nào. Thân cá mập cân đối, thuôn dài, đầu hơi gù, phần đầu và vai to rộng, tạo dáng khỏe mạnh và uy nghi.\\nMột Benigoi đẹp phải có màu đỏ đồng đều, sâu và sáng, không loang lổ; vảy đều, sáng bóng; thân hình chắc khỏe, dáng bơi thẳng và uyển chuyển. Đây là dòng Koi có thể phát triển kích thước lớn, đạt tới 70–90cm trong điều kiện nuôi dưỡng tốt, đồng thời mang tính cách thân thiện, dễ gần. Benigoi được yêu thích bởi sự đơn giản nhưng nổi bật, màu đỏ tượng trưng cho may mắn, thịnh vượng và sức sống, khiến giống cá này trở thành điểm nhấn sang trọng và giá trị cao trong bộ sưu tập Koi."),
            new Variety(null, "Chagoi",
                    "Cá Koi Chagoi là giống cá đơn sắc thuộc nhóm Kawarimono, nổi bật với màu nâu đất, xanh xám hoặc lục nhạt, mang vẻ đẹp giản dị nhưng mạnh mẽ. Đây là dòng Wagoi (có vảy), thường có hiệu ứng viền sáng quanh vảy (fukurin) tạo cảm giác lưới tự nhiên. Thân cá to khỏe, vai rộng, bụng tròn, cặp râu dài và cứng, vây ngực, vây lưng và đuôi dày chắc chắn.\\nMột Chagoi đẹp phải có màu sắc đồng đều, sâu và rõ, không loang lổ; thân hình cân đối, khỏe mạnh; dáng bơi thẳng, uyển chuyển. Đây là dòng Koi phát triển nhanh nhất, có thể đạt kích thước khổng lồ từ 80–100cm, đồng thời nổi tiếng với tính cách hiền hòa, thân thiện, thường là cá đầu tiên ăn từ tay người nuôi và giúp các dòng Koi khác trở nên dạn dĩ hơn.\\nChagoi được yêu thích bởi sự đơn giản nhưng giá trị, mang ý nghĩa tượng trưng cho tình bạn, sự gắn kết và mối quan hệ bền chặt. Chính sự kết hợp giữa kích thước vượt trội, tính cách hiền hòa và màu sắc mộc mạc khiến Chagoi trở thành một trong những giống Koi đặc biệt quan trọng trong bộ sưu tập."),
            new Variety(null, "Hikari Muji",
                    "Cá Koi Hikari Muji (hay Hikari Mono) là dòng cá đơn sắc đặc trưng với lớp vảy kim loại ánh kim rực rỡ, toàn thân chỉ có một màu duy nhất. Đây là nhóm Ogon trong hệ Kawarimono, nổi bật bởi sự óng ánh của vảy và màu sắc thuần khiết, tạo nên vẻ đẹp sang trọng và mạnh mẽ. Vây cá cùng màu với thân, đồng đều và sáng bóng, làm tăng thêm sự hài hòa tổng thể.\\nMột Hikari Muji đẹp phải có màu sắc đồng đều, ánh kim rõ rệt, vảy đều và sáng, thân hình cân đối, khỏe mạnh. Dòng này có nhiều biến thể theo màu sắc: Platinum Ogon (trắng ánh kim), Nezu Ogon (đen ánh kim), Yamabuki Ogon (vàng ánh kim), Hi Ogon (đỏ ánh kim), Orenji Ogon (cam ánh kim), và Mukashi Ogon (xám bạc ánh kim).\\nHikari Muji được yêu thích bởi sự đơn giản nhưng nổi bật, mang lại điểm nhấn mạnh mẽ trong hồ Koi. Với ánh kim lấp lánh và màu sắc thuần khiết, chúng tượng trưng cho sự thịnh vượng, sang trọng và quyền lực, trở thành một trong những giống Koi giá trị cao trong bộ sưu tập."),
            new Variety(null, "Asagi",
                    "Cá Koi Asagi là một trong những giống cá cổ điển nhất trong thế giới Koi, nổi bật với lớp vảy hình quả trám trên lưng tạo thành mạng lưới đều đặn màu xanh bạc trên nền trắng. Đầu cá trắng sáng thuần khiết, trong khi vây, bụng, hông và má thường điểm xuyết thêm sắc đỏ, vàng hoặc kem, lan ra cả mép miệng. Lớp lưới trên lưng phải đều, không bị đứt đoạn, đây là yếu tố quan trọng để đánh giá Asagi đẹp.\\nCác biến thể chính của Asagi gồm: Konjo Asagi với màu xanh chàm đậm gần như đen, Narumi Asagi với màu xanh lam sáng dịu cùng hiệu ứng viền trắng quanh vảy (fukurin), Mizo Asagi với màu xanh nước biển cực nhạt ngả sang xám bạc, và Ginrin Asagi với lớp ánh kim lấp lánh trên vảy lưng phản chiếu ánh sáng rực rỡ.\\nMột Asagi đẹp phải có màu xanh đồng đều, lớp lưới rõ ràng, đầu trắng sạch sẽ không tỳ vết, và sắc đỏ hoặc vàng ở bụng, vây, má phân bổ hài hòa. Thân hình to khỏe, dáng thuôn dài, bơi uyển chuyển, tạo cảm giác thanh thoát nhưng mạnh mẽ. Asagi được xem là biểu tượng của sự cân bằng và hài hòa, mang lại vẻ đẹp cổ điển, tinh tế và giá trị cao trong bộ sưu tập Koi."),
            new Variety(null, "Shusui",
                    "Cá Koi Shusui là thế hệ lai từ Asagi, thuộc nhóm da trơn (Doitsu), nổi bật với hai hàng vảy xanh-đen đối xứng chạy thẳng dọc sống lưng đến tận đuôi. Thân cá sáng, hai bên hông bụng có mảng đỏ hoặc cam rực rỡ kéo dài đến đuôi, ranh giới rõ nét, tạo nên vẻ đẹp thanh thoát và mạnh mẽ.\\nMột Shusui đẹp phải có hàng vảy lưng đều, thẳng hàng, bóng đẹp, không bị đứt đoạn; màu đỏ/cam đồng đều, sắc nét, không loang lổ; thân hình to khỏe, dáng thuôn dài, bơi uyển chuyển. Đây là dòng Koi có thể đạt kích thước lớn (75–90cm), tuổi thọ cao, và được xem là một trong những giống Doitsu Koi đầu tiên, mang giá trị lịch sử đặc biệt.\\nCác biến thể chính gồm: Shusui thường với thân trắng chủ đạo và dải đỏ nhỏ ở hông; Hi Shusui với mảng đỏ chiếm diện tích lớn hơn, nổi bật hơn; ngoài ra còn có Ginrin Shusui (vảy lưng ánh kim lấp lánh) và Mizu Shusui (màu xanh nước biển nhạt gần như xám bạc).\\nShusui được yêu thích bởi sự kết hợp hài hòa giữa ba màu đen – đỏ – trắng (đôi khi xanh lam), tượng trưng cho sự cân bằng và may mắn, khiến giống cá này trở thành điểm nhấn độc đáo trong bộ sưu tập Koi."),
            new Variety(null, "Goshiki",
                    "Cá Koi Goshiki là giống cá lai giữa Kohaku và Asagi, thuộc nhánh Goromo, nổi bật với sự kết hợp màu sắc phức tạp và độc đáo. Nền da trắng sáng phủ lớp vảy dạng lưới xanh–đen, trên đó là các mảng đỏ rực rỡ đặc trưng của Kohaku. Khi thả vào nước lạnh, màu sắc của Goshiki thường tối hơn, tạo hiệu ứng thay đổi theo môi trường.\\nMột Goshiki đẹp phải có màu đỏ (Hi) đậm, sắc nét, không bị lẫn bởi lớp lưới; nền trắng sạch sẽ, không ngả vàng; lớp vảy lưới đều, rõ ràng, không loang lổ. Thân hình to khỏe, vai rộng, dáng bơi thẳng và uyển chuyển. Đây là dòng Koi có thể đạt kích thước lớn (60–90cm) và tuổi thọ cao.\\nCác biến thể chính gồm: Goshiki truyền thống với nền trắng, lưới xanh–đen và mảng đỏ Kohaku; Doitsu Goshiki (dòng da trơn, chỉ có hàng vảy lớn chạy dọc lưng); và Goshiki hiện đại với nền sáng hơn, lưới tinh tế, mảng đỏ rõ ràng, ít bị “bẩn” bởi sashi.\\nGoshiki được yêu thích bởi sự hòa quyện của năm màu sắc: trắng, đỏ, xanh lam, xanh chàm và đen, tượng trưng cho sự cân bằng, sang trọng và may mắn. Chính sự phức tạp và độc đáo này khiến Goshiki trở thành một trong những giống Koi giá trị cao trong bộ sưu tập."),
            new Variety(null, "Ginrin",
                    "Cá Koi Ginrin (Kin/Ginrin) là dòng Nishikigoi đặc trưng bởi lớp vảy lấp lánh như kim cương, phản chiếu ánh sáng mạnh mẽ dưới nước. Đây là một phân loại vảy đặc biệt, không phải một giống cá riêng biệt, có thể xuất hiện trên nhiều dòng Koi như Kohaku, Showa, Sanke hay Chagoi.\\nMột Ginrin đẹp phải có vảy sáng đều, đồng bộ từ đầu đến đuôi; thân hình tròn lẳn, thuôn gọn về phía đuôi, đầu hơi gù, miệng lớn, râu dài và to; màu nền của giống Koi gốc phải rõ ràng, không bị mờ bởi ánh vảy. Khác với ánh kim loại (Hikari) tạo hiệu ứng sáng liên tục, Ginrin lấp lánh từng vảy riêng biệt, tạo hiệu ứng lung linh độc đáo.\\nCác loại vảy Ginrin gồm: Diamond Ginrin (vảy phản chiếu toàn diện, sáng mạnh nhất), Pearl Ginrin (điểm sáng tập trung ở trung tâm vảy), Kado Ginrin (ánh sáng tập trung ở viền vảy), và Beta Ginrin (phản chiếu ánh sáng ở phần trên vảy).\\nGinrin được yêu thích bởi vẻ đẹp lung linh, sang trọng, thường có giá trị cao hơn cá cùng loại không có vảy kim tuyến. Trong phong thủy, ánh sáng lấp lánh của Ginrin tượng trưng cho sự thịnh vượng, may mắn và tài lộc, khiến giống cá này trở thành điểm nhấn đặc biệt trong bộ sưu tập Koi."),
            new Variety(null, "Hikarimoyo",
                    "Cá Koi Hikarimoyo là dòng Koi ánh kim đa sắc, nổi bật với lớp vảy kim loại và da ánh kim óng ánh, kết hợp từ hai đến nhiều màu sắc cùng hoa văn ngẫu nhiên. Đây là nhóm Koi mang vẻ đẹp rực rỡ, sang trọng, thường được xem là điểm nhấn trong hồ Koi nhờ sự đa dạng màu sắc và ánh sáng phản chiếu mạnh mẽ.\\nMột Hikarimoyo đẹp phải có lớp vảy ánh kim đồng đều, sáng bóng, màu sắc rõ ràng, hoa văn phân bố hài hòa; thân hình cân đối, khỏe mạnh, dáng bơi uyển chuyển.\\nCác biến thể chính gồm: Hariwake với hoa văn màu cam hoặc vàng trên nền ánh kim. Yamato Nishiki với Hoa văn đỏ kết hợp đốm đen, tạo sự tương phản mạnh. Kujaku với Nền bạch kim với vảy hình chữ nhật, hoa văn màu cam hoặc đỏ. Kikusui với Hoa văn đỏ, thuộc dòng da trơn Doitsu (không vảy), mang vẻ đẹp thanh thoát.\\nHikarimoyo được yêu thích bởi sự đa dạng và rực rỡ, tượng trưng cho sự thịnh vượng, may mắn và quyền lực. Chính sự kết hợp giữa ánh kim lấp lánh và hoa văn đa sắc khiến Hikarimoyo trở thành một trong những giống Koi giá trị cao, thường được lựa chọn để làm nổi bật hồ Koi."),
            new Variety(null, "Kawarimono",
                    "Cá Koi Kawarimono là nhóm phân loại rất lớn dành cho tất cả các giống Koi phi kim loại không nằm trong các nhóm ánh kim (Hikari) hay hoa văn truyền thống. Đây là dòng đa dạng nhất, bao gồm nhiều biến thể đơn sắc và các kiểu hoa văn đặc biệt, mang vẻ đẹp mộc mạc nhưng mạnh mẽ.\\nMột Kawarimono đẹp thường có thân hình vạm vỡ, dài, đầu to thuôn dài, xương vây ngực dày chắc; da mờ (matte) nhưng bóng mịn tự nhiên, phản ánh màu sắc sâu và đặc; vảy đa dạng, có thể là vảy lưới thô hoặc vảy kim cương; hoa văn trải dài từ đơn sắc hoàn toàn đến các mô hình phức tạp, thậm chí có dòng tự biến đổi theo nhiệt độ môi trường.\\nCác phân loại chính gồm: Koi đơn sắc (Single Colored) như Magoi, Chagoi, Soragoi, Kigoi, Benigoi. Magoi (Hắc Long cổ đại) với thân đen xám hoặc nâu đất tối, vảy lưới thô, kích thước cực đại, mang tính hoang dã. Karasugoi với toàn thân đen tuyền, sâu hơn Magoi, thân mập mạp. Hajiro, Hageshiro, Yotsujiro là các biến thể đen với điểm trắng ở vây hoặc đầu, rất hiếm. Matsubagoi là cá đơn sắc (vàng, đỏ, trắng) nhưng mỗi vảy có tâm đen tạo hiệu ứng quả thông (Aka Matsuba, Ki Matsuba). Koi chuyển màu như Ochiba Shigure với họa tiết lá thu rơi (nâu/cam trên nền xám bạc); Midorigoi cực hiếm với màu xanh lục nhạt hoặc xanh lá cây, thường thuộc dòng da trơn Doitsu.\\nKawarimono được yêu thích bởi sự đa dạng, kích thước vượt trội và tính cách thân thiện. Trong phong thủy, nhóm này tượng trưng cho sự bền bỉ, sức mạnh và khả năng thích nghi, khiến chúng trở thành nền tảng quan trọng trong bất kỳ bộ sưu tập Koi nào."));

    private static final List<Mutation> SAMPLE_MUTATIONS = List.of(
            new Mutation(null, "Ginrin", BigDecimal.valueOf(0.05), BigDecimal.valueOf(0.98),
                    "Phát triển vảy kim cương làm giảm nhẹ kích thước tối đa."),
            new Mutation(null, "Doitsu", BigDecimal.valueOf(0.05), BigDecimal.valueOf(1.0),
                    "Kích thước tối đa tương đương dòng chuẩn."),
            new Mutation(null, "Butterfly", BigDecimal.valueOf(0.05), BigDecimal.valueOf(0.95),
                    "Thân hình mảnh mai, chiều dài thân ngắn hơn."),
            new Mutation(null, "Jumbo Gene", BigDecimal.valueOf(0.05), BigDecimal.valueOf(1.08),
                    "Đột biến kích thước khổng lồ, giá trị cực cao."),
            new Mutation(null, "Bonsai Gene", BigDecimal.valueOf(0.05), BigDecimal.valueOf(0.9),
                    "Đột biến gen lùn, thân hình ngắn."));

    private static final List<Dictionary> SAMPLE_DICTIONARIES = List.of(
            new Dictionary(null, "Kohaku", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(0), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.015), 400, BigDecimal.valueOf(0.000015), 100,
                    BigDecimal.valueOf(1.68), null),
            new Dictionary(null, "Menkaburi Kohaku", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(0), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.015), 400, BigDecimal.valueOf(0.000015), 110,
                    BigDecimal.valueOf(1.69), null),
            new Dictionary(null, "Kuchibeni Kohaku", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(0), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0149), 400, BigDecimal.valueOf(0.000015), 120,
                    BigDecimal.valueOf(1.7), null),
            new Dictionary(null, "Inazuma Kohaku", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(0), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.015), 400, BigDecimal.valueOf(0.000015), 180,
                    BigDecimal.valueOf(1.75), null),
            new Dictionary(null, "Maruten Kohaku", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(0), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0149), 400, BigDecimal.valueOf(0.000015), 160,
                    BigDecimal.valueOf(1.74), null),
            new Dictionary(null, "Straight Hi Kohaku", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(0),
                    "Japan", BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0151), 400, BigDecimal.valueOf(0.000015),
                    105, BigDecimal.valueOf(1.68), null),
            new Dictionary(null, "Tancho Kohaku", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(0), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0149), 400, BigDecimal.valueOf(0.000015), 220,
                    BigDecimal.valueOf(1.9), null),
            new Dictionary(null, "Doitsu Kohaku", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(0), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0152), 400, BigDecimal.valueOf(0.000015), 150,
                    BigDecimal.valueOf(1.72), null),
            new Dictionary(null, "Nidan Kohaku", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(0), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.015), 400, BigDecimal.valueOf(0.000015), 130,
                    BigDecimal.valueOf(1.7), null),
            new Dictionary(null, "Ginrin Kohaku", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(0), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0148), 400, BigDecimal.valueOf(0.000015), 170,
                    BigDecimal.valueOf(1.75), null),
            new Dictionary(null, "Tancho", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(1), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0148), 400, BigDecimal.valueOf(0.000015), 180,
                    BigDecimal.valueOf(1.86), null),
            new Dictionary(null, "Tancho Sanke", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(1), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0145), 400, BigDecimal.valueOf(0.000015), 240,
                    BigDecimal.valueOf(1.92), null),
            new Dictionary(null, "Tancho Showa", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(1), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0138), 400, BigDecimal.valueOf(0.000015), 260,
                    BigDecimal.valueOf(1.95), null),
            new Dictionary(null, "Taisho Sanke", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(2), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0142), 410, BigDecimal.valueOf(0.000015), 120,
                    BigDecimal.valueOf(1.72), null),
            new Dictionary(null, "Yamato Nishiki", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(2), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.014), 410, BigDecimal.valueOf(0.000015), 170,
                    BigDecimal.valueOf(1.78), null),
            new Dictionary(null, "Kuchibeni Sanke", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(2), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0142), 410, BigDecimal.valueOf(0.000015), 140,
                    BigDecimal.valueOf(1.74), null),
            new Dictionary(null, "Aka Sanke", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(2), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0145), 410, BigDecimal.valueOf(0.000015), 130,
                    BigDecimal.valueOf(1.73), null),
            new Dictionary(null, "Subo Sumi Sanke / Tsubo Sumi Sanke", Shape.STANDARD, ScaleType.WAGOI,
                    SAMPLE_VARIETIES.get(2), "Japan", BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.014), 410,
                    BigDecimal.valueOf(0.000015), 160, BigDecimal.valueOf(1.76), null),
            new Dictionary(null, "Maruten Sanke", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(2), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0141), 410, BigDecimal.valueOf(0.000015), 170,
                    BigDecimal.valueOf(1.78), null),
            new Dictionary(null, "Doitsu Sanke", Shape.STANDARD, ScaleType.DOITSU, SAMPLE_VARIETIES.get(2), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0144), 410, BigDecimal.valueOf(0.000015), 160,
                    BigDecimal.valueOf(1.75), null),
            new Dictionary(null, "Ginrin Sanke", Shape.STANDARD, ScaleType.GINRIN, SAMPLE_VARIETIES.get(2), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.014), 410, BigDecimal.valueOf(0.000015), 190,
                    BigDecimal.valueOf(1.8), null),
            new Dictionary(null, "Showa Sanshoku", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(3), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0135), 420, BigDecimal.valueOf(0.000015), 130,
                    BigDecimal.valueOf(1.8), null),
            new Dictionary(null, "Hi Showa", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(3), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0136), 420, BigDecimal.valueOf(0.000015), 140,
                    BigDecimal.valueOf(1.81), null),
            new Dictionary(null, "Kindai Showa", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(3), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0134), 420, BigDecimal.valueOf(0.000015), 170,
                    BigDecimal.valueOf(1.84), null),
            new Dictionary(null, "Maruten Showa", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(3), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0135), 420, BigDecimal.valueOf(0.000015), 180,
                    BigDecimal.valueOf(1.85), null),
            new Dictionary(null, "Doitsu Showa", Shape.STANDARD, ScaleType.DOITSU, SAMPLE_VARIETIES.get(3), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0138), 420, BigDecimal.valueOf(0.000015), 170,
                    BigDecimal.valueOf(1.82), null),
            new Dictionary(null, "Ginrin Showa", Shape.STANDARD, ScaleType.GINRIN, SAMPLE_VARIETIES.get(3), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0133), 420, BigDecimal.valueOf(0.000015), 200,
                    BigDecimal.valueOf(1.88), null),
            new Dictionary(null, "Goromo", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(4), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.014), 450, BigDecimal.valueOf(0.000015), 170,
                    BigDecimal.valueOf(1.78), null),
            new Dictionary(null, "Aigoromo (Ai Goromo)", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(4),
                    "Japan", BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.014), 450, BigDecimal.valueOf(0.000015),
                    180, BigDecimal.valueOf(1.8), null),
            new Dictionary(null, "Sumigoromo", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(4), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0138), 450, BigDecimal.valueOf(0.000015), 190,
                    BigDecimal.valueOf(1.82), null),
            new Dictionary(null, "Budo Koromo (Budo Goromo)", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(4),
                    "Japan", BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0139), 450, BigDecimal.valueOf(0.000015),
                    220, BigDecimal.valueOf(1.85), null),
            new Dictionary(null, "Koromo Showa (Goromo Showa)", Shape.STANDARD, ScaleType.WAGOI,
                    SAMPLE_VARIETIES.get(4), "Japan", BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0135), 450,
                    BigDecimal.valueOf(0.000015), 240, BigDecimal.valueOf(1.88), null),
            new Dictionary(null, "Utsuri", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(5), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0136), 440, BigDecimal.valueOf(0.000015), 150,
                    BigDecimal.valueOf(1.76), null),
            new Dictionary(null, "Ginrin Shiro Utsuri", Shape.STANDARD, ScaleType.GINRIN, SAMPLE_VARIETIES.get(5),
                    "Japan", BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0136), 440, BigDecimal.valueOf(0.000015),
                    210, BigDecimal.valueOf(1.84), null),
            new Dictionary(null, "Ginrin Hi Utsuri", Shape.STANDARD, ScaleType.GINRIN, SAMPLE_VARIETIES.get(5), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0134), 440, BigDecimal.valueOf(0.000015), 220,
                    BigDecimal.valueOf(1.84), null),
            new Dictionary(null, "Ginrin Ki Utsuri", Shape.STANDARD, ScaleType.GINRIN, SAMPLE_VARIETIES.get(5), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0133), 440, BigDecimal.valueOf(0.000015), 280,
                    BigDecimal.valueOf(1.94), null),
            new Dictionary(null, "Shiro Utsuri Doitsu", Shape.STANDARD, ScaleType.DOITSU, SAMPLE_VARIETIES.get(5),
                    "Japan", BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0138), 440, BigDecimal.valueOf(0.000015),
                    230, BigDecimal.valueOf(1.88), null),
            new Dictionary(null, "Hi Utsuri Doitsu", Shape.STANDARD, ScaleType.DOITSU, SAMPLE_VARIETIES.get(5), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0138), 440, BigDecimal.valueOf(0.000015), 210,
                    BigDecimal.valueOf(1.82), null),
            new Dictionary(null, "Ki Utsuri Doitsu", Shape.STANDARD, ScaleType.DOITSU, SAMPLE_VARIETIES.get(5), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0137), 440, BigDecimal.valueOf(0.000015), 270,
                    BigDecimal.valueOf(1.92), null),
            new Dictionary(null, "Hikari Shiro Utsuri", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(6),
                    "Japan", BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0137), 430, BigDecimal.valueOf(0.000015),
                    240, BigDecimal.valueOf(1.86), null),
            new Dictionary(null, "Hi Utsuri", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(6), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0136), 430, BigDecimal.valueOf(0.000015), 170,
                    BigDecimal.valueOf(1.78), null),
            new Dictionary(null, "Ki Utsuri", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(6), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0135), 430, BigDecimal.valueOf(0.000015), 230,
                    BigDecimal.valueOf(1.9), null),
            new Dictionary(null, "Shiro Bekko", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(7), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0146), 440, BigDecimal.valueOf(0.000015), 130,
                    BigDecimal.valueOf(1.68), null),
            new Dictionary(null, "Aka Bekko", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(7), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0145), 430, BigDecimal.valueOf(0.000015), 150,
                    BigDecimal.valueOf(1.72), null),
            new Dictionary(null, "Ki Bekko", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(7), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0144), 430, BigDecimal.valueOf(0.000015), 190,
                    BigDecimal.valueOf(1.82), null),
            new Dictionary(null, "Karashi", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(8), "Japan",
                    BigDecimal.valueOf(100.0), BigDecimal.valueOf(0.0185), 320, BigDecimal.valueOf(0.000017), 180,
                    BigDecimal.valueOf(1.56), null),
            new Dictionary(null, "Benigoi", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(9), "Japan",
                    BigDecimal.valueOf(95.0), BigDecimal.valueOf(0.0175), 330, BigDecimal.valueOf(0.000017), 130,
                    BigDecimal.valueOf(1.58), null),
            new Dictionary(null, "Chagoi", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(10), "Japan",
                    BigDecimal.valueOf(100.0), BigDecimal.valueOf(0.019), 300, BigDecimal.valueOf(0.000018), 150,
                    BigDecimal.valueOf(1.5), null),
            new Dictionary(null, "Midorigoi", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(10), "Japan",
                    BigDecimal.valueOf(100.0), BigDecimal.valueOf(0.017), 300, BigDecimal.valueOf(0.000017), 280,
                    BigDecimal.valueOf(1.9), null),
            new Dictionary(null, "Soragoi", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(10), "Japan",
                    BigDecimal.valueOf(100.0), BigDecimal.valueOf(0.0185), 300, BigDecimal.valueOf(0.000018), 160,
                    BigDecimal.valueOf(1.55), null),
            new Dictionary(null, "Platinum Ogon", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(11), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0162), 360, BigDecimal.valueOf(0.000016), 170,
                    BigDecimal.valueOf(1.66), null),
            new Dictionary(null, "Yamabuki Ogon", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(11), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0168), 360, BigDecimal.valueOf(0.000017), 180,
                    BigDecimal.valueOf(1.64), null),
            new Dictionary(null, "Hi Ogon", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(11), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0163), 360, BigDecimal.valueOf(0.000016), 170,
                    BigDecimal.valueOf(1.66), null),
            new Dictionary(null, "Orenji Ogon", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(11), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0162), 360, BigDecimal.valueOf(0.000016), 170,
                    BigDecimal.valueOf(1.66), null),
            new Dictionary(null, "Mukashi Ogon", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(11), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0158), 360, BigDecimal.valueOf(0.000016), 200,
                    BigDecimal.valueOf(1.72), null),
            new Dictionary(null, "Nezu Ogon", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(11), "Japan",
                    BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0158), 360, BigDecimal.valueOf(0.000016), 170,
                    BigDecimal.valueOf(1.65), null),
            new Dictionary(null, "Konjo Asagi", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(12), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0148), 480, BigDecimal.valueOf(0.000015), 180,
                    BigDecimal.valueOf(1.74), null),
            new Dictionary(null, "Narumi Asagi", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(12), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0149), 480, BigDecimal.valueOf(0.000015), 170,
                    BigDecimal.valueOf(1.72), null),
            new Dictionary(null, "Mizo Asagi", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(12), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0148), 480, BigDecimal.valueOf(0.000015), 190,
                    BigDecimal.valueOf(1.75), null),
            new Dictionary(null, "Ginrin Asagi", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(12), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0148), 480, BigDecimal.valueOf(0.000015), 220,
                    BigDecimal.valueOf(1.82), null),
            new Dictionary(null, "Shusui", Shape.STANDARD, ScaleType.DOITSU, SAMPLE_VARIETIES.get(13), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0152), 470, BigDecimal.valueOf(0.000015), 200,
                    BigDecimal.valueOf(1.78), null),
            new Dictionary(null, "Hi Shusui", Shape.STANDARD, ScaleType.DOITSU, SAMPLE_VARIETIES.get(13), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0151), 480, BigDecimal.valueOf(0.000015), 210,
                    BigDecimal.valueOf(1.8), null),
            new Dictionary(null, "Goshiki", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(14), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.014), 460, BigDecimal.valueOf(0.000015), 220,
                    BigDecimal.valueOf(1.88), null),
            new Dictionary(null, "Ginrin", Shape.STANDARD, ScaleType.GINRIN, SAMPLE_VARIETIES.get(15), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.015), 410, BigDecimal.valueOf(0.000015), 180,
                    BigDecimal.valueOf(1.72), null),
            new Dictionary(null, "Hariwake", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(16), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0158), 420, BigDecimal.valueOf(0.000016), 210,
                    BigDecimal.valueOf(1.8), null),
            new Dictionary(null, "Kujaku", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(16), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0152), 420, BigDecimal.valueOf(0.000016), 250,
                    BigDecimal.valueOf(1.92), null),
            new Dictionary(null, "Kikusui", Shape.STANDARD, ScaleType.DOITSU, SAMPLE_VARIETIES.get(16), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0154), 420, BigDecimal.valueOf(0.000015), 240,
                    BigDecimal.valueOf(1.9), null),
            new Dictionary(null, "Magoi", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(17), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.02), 420, BigDecimal.valueOf(0.000018), 320,
                    BigDecimal.valueOf(1.52), null),
            new Dictionary(null, "Tea Chagoi", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(17), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.019), 420, BigDecimal.valueOf(0.000018), 150,
                    BigDecimal.valueOf(1.5), null),
            new Dictionary(null, "Kigoi", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(17), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0165), 420, BigDecimal.valueOf(0.000017), 260,
                    BigDecimal.valueOf(1.86), null),
            new Dictionary(null, "Karasugoi", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(17), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.018), 420, BigDecimal.valueOf(0.000017), 140,
                    BigDecimal.valueOf(1.65), null),
            new Dictionary(null, "Hagheshiro", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(17), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.014), 420, BigDecimal.valueOf(0.000015), 300,
                    BigDecimal.valueOf(1.94), null),
            new Dictionary(null, "Yotsujiro", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(17), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0143), 420, BigDecimal.valueOf(0.000015), 270,
                    BigDecimal.valueOf(1.9), null),
            new Dictionary(null, "Aka Matsuba", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(17), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0155), 420, BigDecimal.valueOf(0.000015), 190,
                    BigDecimal.valueOf(1.76), null),
            new Dictionary(null, "Ki Matsuba", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(17), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0154), 420, BigDecimal.valueOf(0.000015), 210,
                    BigDecimal.valueOf(1.78), null),
            new Dictionary(null, "Ochiba Shigure", Shape.STANDARD, ScaleType.WAGOI, SAMPLE_VARIETIES.get(17), "Japan",
                    BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0178), 420, BigDecimal.valueOf(0.000017), 180,
                    BigDecimal.valueOf(1.6), null));

    public static List<Variety> getSampleVarietyList() {
        return SampleData.SAMPLE_VARIETIES;
    }

    public static List<Mutation> getSampleMutationList() {
        return SampleData.SAMPLE_MUTATIONS;
    }

    public static List<Dictionary> getSampleDictionaryList() {
        return SampleData.SAMPLE_DICTIONARIES;
    }
}
