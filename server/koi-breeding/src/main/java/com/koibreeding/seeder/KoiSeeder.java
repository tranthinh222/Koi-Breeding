package com.koibreeding.seeder;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.koibreeding.domain.Dictionary;
import com.koibreeding.domain.Koi;
import com.koibreeding.domain.Pond;
import com.koibreeding.domain.User;
import com.koibreeding.repository.DictionaryRepository;
import com.koibreeding.repository.KoiRepository;
import com.koibreeding.repository.PondRepository;
import com.koibreeding.repository.UserRepository;
import com.koibreeding.util.formulas.KoiFormula;

@Component
@Order(11)
public class KoiSeeder implements CommandLineRunner {
    private KoiRepository koiRepository;
    private DictionaryRepository dictionaryRepository;
    private PondRepository pondRepository;
    private UserRepository userRepository;
    private KoiFormula koiFormula;

    public KoiSeeder(KoiRepository koiRepository, DictionaryRepository dictionaryRepository,
            PondRepository pondRepository, UserRepository userRepository, KoiFormula koiFormula) {
        this.koiRepository = koiRepository;
        this.dictionaryRepository = dictionaryRepository;
        this.pondRepository = pondRepository;
        this.userRepository = userRepository;
        this.koiFormula = koiFormula;
    }

    @Override
    public void run(String... args) throws Exception {
        if (koiRepository.count() > 0) {
            System.out.println(">>> Kois already exist");
            return;
        }

        List<String> defaultUsers = new ArrayList<>();
        for (int i = 1; i <= 5; ++i) {
            defaultUsers.add("admin" + i);
            defaultUsers.add("player" + i);
        }

        List<User> existingUserList = userRepository.findAll().stream()
                .filter(user -> defaultUsers.contains(user.getUsername())).collect(Collectors.toList());

        List<String> sampleKoiVarientList = List.of("Kohaku", "Straight Hi Kohaku", "Tancho Sanke",
                "Yamato Nishiki",
                "Kindai Showa");

        List<Dictionary> koiVarientList = dictionaryRepository.findByNameIn(sampleKoiVarientList);

        List<Koi> koisToSave = new ArrayList<>();

        for (User user : existingUserList) {
            Pond pond = pondRepository.findByOwner_IdAndName(user.getId(), "Kohaku Garden").get(0);
            koisToSave.addAll(koiVarientList.stream()
                    .map(koiVarient -> koiFormula.generateStarterKoi(koiVarient, pond))
                    .collect(Collectors.toList()));

        }

        koiRepository.saveAll(koisToSave);
        System.out.println(">>> Seeded Kois Successfully");
    }
}
