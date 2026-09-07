package com.koibreeding.seeder;

import static java.util.Map.entry;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.koibreeding.domain.BreedingRate;
import com.koibreeding.domain.Dictionary;
import com.koibreeding.enums.BreedingRecipeType;
import com.koibreeding.enums.ScaleType;
import com.koibreeding.repository.BreedingRateRepository;
import com.koibreeding.repository.DictionaryRepository;

@Component
@Order(12)
public class BreedingRateSeeder implements CommandLineRunner {
    private BreedingRateRepository breedingRateRepository;
    private DictionaryRepository dictionaryRepository;

    public BreedingRateSeeder(BreedingRateRepository breedingRateRepository,
            DictionaryRepository dictionaryRepository) {
        this.breedingRateRepository = breedingRateRepository;
        this.dictionaryRepository = dictionaryRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (breedingRateRepository.count() > 0) {
            System.out.println(">>> Breeding Rates already exist");
            return;
        }

        Map<String, Dictionary> dictMap = dictionaryRepository.findAll().stream()
                .filter(Objects::nonNull)
                .filter(v -> v.getName() != null)
                .collect(Collectors.toMap(
                        v -> v.getName(),
                        item -> item,
                        (left, right) -> left,
                        LinkedHashMap::new));

        // Classify by variety
        List<Dictionary> kohakus = dictMap.values().stream()
                .filter(d -> "Kohaku".equals(d.getVariety().getName())).toList();
        List<Dictionary> tanchos = dictMap.values().stream()
                .filter(d -> "Tancho".equals(d.getVariety().getName())).toList();
        List<Dictionary> taishoSankes = dictMap.values().stream()
                .filter(d -> "Taisho Sanke".equals(d.getVariety().getName())).toList();
        List<Dictionary> showaSanshokus = dictMap.values().stream()
                .filter(d -> "Showa Sanshoku".equals(d.getVariety().getName())).toList();
        List<Dictionary> goromos = dictMap.values().stream()
                .filter(d -> "Goromo".equals(d.getVariety().getName())).toList();
        List<Dictionary> utsuris = dictMap.values().stream()
                .filter(d -> "Utsuri".equals(d.getVariety().getName())).toList();
        // List<Dictionary> hikariUtsuris = dictMap.values().stream()
        // .filter(d -> "Hikari Utsuri".equals(d.getVariety().getName())).toList();
        // List<Dictionary> bekkos = dictMap.values().stream()
        // .filter(d -> "Bekko".equals(d.getVariety().getName())).toList();
        // List<Dictionary> karashis = dictMap.values().stream()
        // .filter(d -> "Karashi".equals(d.getVariety().getName())).toList();
        List<Dictionary> benigois = dictMap.values().stream()
                .filter(d -> "Benigoi".equals(d.getVariety().getName())).toList();
        List<Dictionary> chagois = dictMap.values().stream()
                .filter(d -> "Chagoi".equals(d.getVariety().getName())).toList();
        List<Dictionary> hikariMujis = dictMap.values().stream()
                .filter(d -> "Hikari Muji".equals(d.getVariety().getName())).toList();
        List<Dictionary> asagis = dictMap.values().stream()
                .filter(d -> "Asagi".equals(d.getVariety().getName())).toList();
        List<Dictionary> shusuis = dictMap.values().stream()
                .filter(d -> "Shusui".equals(d.getVariety().getName())).toList();
        List<Dictionary> goshikis = dictMap.values().stream()
                .filter(d -> "Goshiki".equals(d.getVariety().getName())).toList();
        // List<Dictionary> hikarimoyos = dictMap.values().stream()
        // .filter(d -> "Hikarimoyo".equals(d.getVariety().getName())).toList();
        // List<Dictionary> kawarimonos = dictMap.values().stream()
        // .filter(d -> "Kawarimono".equals(d.getVariety().getName())).toList();

        List<Dictionary> doitsus = dictMap.values().stream()
                .filter(d -> ScaleType.DOITSU.equals(d.getScaleType())).toList();
        List<Dictionary> ginrins = dictMap.values().stream()
                .filter(d -> ScaleType.GINRIN.equals(d.getScaleType())).toList();

        List<BreedingRate> sampleBreedingRates = new ArrayList<>();

        // Added cache to check duplicates (A + B = C)
        Set<String> generatedCombinations = new HashSet<>();

        /*
         * =============================================================================
         * ============
         * GROUP 1: CROSS BREEDING
         * =============================================================================
         * ============
         */

        // 1. Kohaku x Utsuri => Showa (Target: 0.25)
        Map<String, Double> showaSubRates = Map.of(
                "Tancho Showa", 0.005,
                "Maruten Showa", 0.0325,
                "Hi Showa", 0.075,
                "Kindai Showa", 0.1375);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, kohakus, utsuris,
                BreedingRecipeType.CROSS, 0.25,
                0.35, 0.3,
                showaSubRates);

        // 2. Kohaku x Asagi => Goromo (Target: 0.20)
        Map<String, Double> goromoSubRates = Map.of(
                "Aigoromo", 0.14,
                "Sumigoromo", 0.04,
                "Budo Koromo", 0.02);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, kohakus, asagis,
                BreedingRecipeType.CROSS, 0.20,
                0.35, 0.35,
                goromoSubRates);

        // 3. Asagi x Doitsu
        Map<String, Double> shusuiSubRates = Map.of(
                "Shusui", 0.12,
                "Hi Shusui", 0.18);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, asagis, doitsus,
                BreedingRecipeType.CROSS, 0.30,
                0.4, 0.2,
                shusuiSubRates);

        // 4. Asagi x Kohaku
        Map<String, Double> goshikiSubRates1 = Map.of(
                "Goshiki", 0.12,
                "Modern Goshiki", 0.08);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, asagis, kohakus,
                BreedingRecipeType.CROSS, 0.2,
                0.35, 0.35,
                goshikiSubRates1);

        // 5. Asagi x Taisho Sanke
        Map<String, Double> goshikiSubRates2 = Map.of(
                "Goshiki", 0.12,
                "Modern Goshiki", 0.03);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, asagis,
                taishoSankes,
                BreedingRecipeType.CROSS,
                0.15, 0.35,
                0.4,
                goshikiSubRates2);

        // 6. Chagoi x Kigoi
        Map<String, Double> karashiSoragoiSubRates = Map.of(
                "Karashi", 0.225,
                "Soragoi", 0.025);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, chagois,
                List.of(dictMap.get("Kigoi")),
                BreedingRecipeType.CROSS, 0.25, 0.4,
                0.25,
                karashiSoragoiSubRates);

        // 7. Asagi x Magoi
        Map<String, Double> chagoiSubRates = Map.of(
                "Chagoi", 0.15);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, asagis,
                List.of(dictMap.get("Magoi")),
                BreedingRecipeType.CROSS, 0.15, 0.3,
                0.45,
                chagoiSubRates);

        // 8. Doitsu x Magoi
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, doitsus,
                List.of(dictMap.get("Magoi")),
                BreedingRecipeType.CROSS, 0.15, 0.3,
                0.45,
                chagoiSubRates);

        // 9. Chagoi x Asagi
        Map<String, Double> soragoiSubRates = Map.of(
                "Soragoi", 0.25);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, chagois, asagis,
                BreedingRecipeType.CROSS, 0.25, 0.4,
                0.25,
                soragoiSubRates);

        // 10. Asagi x Benigoi
        Map<String, Double> matsubagoiSubRates1 = Map.of(
                "Aka Matsuba", 0.18,
                "Ki Matsuba", 0.02);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, asagis, benigois,
                BreedingRecipeType.CROSS, 0.2, 0.35,
                0.35,
                matsubagoiSubRates1);

        // 11. Asagi x Kigoi
        Map<String, Double> matsubagoiSubRates2 = Map.of(
                "Ki Matsuba", 0.18,
                "Aka Matsuba", 0.02);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, asagis,
                List.of(dictMap.get("Kigoi")),
                BreedingRecipeType.CROSS, 0.2, 0.35,
                0.35,
                matsubagoiSubRates2);

        // 12. Asagi x Kigoi
        Map<String, Double> ochibashigureSubRates = Map.of(
                "Ochiba Shigure", 0.3);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap,
                List.of(dictMap.get("Soragoi")), chagois,
                BreedingRecipeType.CROSS, 0.3, 0.3,
                0.3,
                ochibashigureSubRates);

        // 13. Yamabuki Ogon x Shusui
        Map<String, Double> midorigoiSubRates = Map.of(
                "Midorigoi", 0.02);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap,
                List.of(dictMap.get("Yamabuki Ogon")), shusuis,
                BreedingRecipeType.CROSS, 0.02, 0.25,
                0.45,
                midorigoiSubRates);

        // 13. Goromo x Showa Sanshoku
        Map<String, Double> koromoShowaSubRates1 = Map.of(
                "Koromo Showa", 0.05);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, goromos,
                showaSanshokus,
                BreedingRecipeType.CROSS, 0.05, 0.15,
                0.4,
                koromoShowaSubRates1);

        // 13. Goromo x Utsuri
        Map<String, Double> koromoShowaSubRates2 = Map.of(
                "Koromo Showa", 0.03);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, goromos, utsuris,
                BreedingRecipeType.CROSS, 0.03, 0.1,
                0.3,
                koromoShowaSubRates2);

        /*
         * =============================================================================
         * ============
         * GROUP 2: PURE BREEDING
         * =============================================================================
         * ============
         */

        // 1. Magoi x Magoi
        List<String> magoiPatterns = List.of("Magoi");
        Map<String, Double> magoiMutations = Map.ofEntries(
                entry("Konjo Asagi", 0.0075),
                entry("Narumi Asagi", 0.0075),
                entry("Mizo Asagi", 0.0075),
                entry("Ginrin Asagi", 0.0075),
                entry("Chagoi", 0.01),
                entry("Midorigoi", 0.01),
                entry("Soragoi", 0.01),
                entry("Kohaku", 0.02),
                entry("Ginrin Shiro Utsuri", 0.005),
                entry("Ginrin Hi Utsuri", 0.005),
                entry("Ginrin Ki Utsuri", 0.005),
                entry("Shiro Utsuri Doitsu", 0.005),
                entry("Hi Utsuri Doitsu", 0.005),
                entry("Ki Utsuri Doitsu", 0.005),
                entry("Kigoi", 0.04),
                entry("Karasugoi", 0.03));
        addPureBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, List.of(dictMap.get("Magoi")),
                0.78,
                magoiPatterns,
                magoiMutations);

        // 2. Kohaku x Kohaku => Kohaku
        List<String> kohakuPatterns = List.of(
                "Menkaburi Kohaku", "Kuchibeni Kohaku", "Inazuma Kohaku",
                "Maruten Kohaku", "Straight Hi Kohaku", "Nidan Kohaku");
        Map<String, Double> kohakuMutations = Map.of(
                "Tancho Kohaku", 0.05,
                "Benigoi", 0.04);
        addPureBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, kohakus, 0.78, kohakuPatterns,
                kohakuMutations);

        // 3. Taisho Sanke x Taisho Sanke
        List<String> taishoSankePatterns = List.of(
                "Kuchibeni Sanke", "Aka Sanke", "Subo Sumi Sanke",
                "Maruten Sanke");
        Map<String, Double> taishoSankeMutations = Map.of(
                "Shiro Bekko", 0.02,
                "Aka Bekko", 0.02,
                "Ki Bekko", 0.02,
                "Tancho Sanke", 0.03);
        addPureBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, taishoSankes, 0.88,
                taishoSankePatterns,
                taishoSankeMutations);

        // 4. Showa Sanshoku x Showa Sanshoku
        List<String> showaSanshokuPatterns = List.of(
                "Hi Showa", "Kindai Showa", "Maruten Showa");
        Map<String, Double> showaSanshokuMutations = Map.of("Tancho Showa", 0.05);
        addPureBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, showaSanshokus, 0.87,
                showaSanshokuPatterns,
                showaSanshokuMutations);

        // 5. Utsuri x Utsuri
        List<String> utsuriPatterns = List.of(
                "Ginrin Shiro Utsuri", "Ginrin Hi Utsuri", "Ginrin Ki Utsuri",
                "Shiro Utsuri Doitsu", "Hi Utsuri Doitsu", "Ki Utsuri Doitsu");
        Map<String, Double> utsuriMutations = Map.of();
        addPureBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, utsuris, 0.9, utsuriPatterns,
                utsuriMutations);

        // 6. Benigoi x Benigoi
        List<String> benigoiPatterns = List.of(
                "Benigoi");
        Map<String, Double> benigoiMutations = Map.of(
                "Kigoi", 0.06);
        addPureBreedingRates(sampleBreedingRates, generatedCombinations, dictMap,
                List.of(dictMap.get("Benigoi")), 0.9,
                benigoiPatterns,
                benigoiMutations);

        // 7. Karasugoi x Karasugoi
        List<String> karasugoiPatterns = List.of(
                "Karasugoi");
        Map<String, Double> karasugoiMutations = Map.of(
                "Hajiro", 0.08);
        addPureBreedingRates(sampleBreedingRates, generatedCombinations, dictMap,
                List.of(dictMap.get("Karasugoi")),
                0.85, karasugoiPatterns,
                karasugoiMutations);

        // 8. Hajiro x Hajiro
        List<String> hajiroPatterns = List.of(
                "Hajiro");
        Map<String, Double> hajiroMutations = Map.of(
                "Hagheshiro", 0.05);
        addPureBreedingRates(sampleBreedingRates, generatedCombinations, dictMap,
                List.of(dictMap.get("Hajiro")), 0.8,
                hajiroPatterns,
                hajiroMutations);

        // 9. Hagheshiro x Hagheshiro
        List<String> hagheshiroPatterns = List.of(
                "Hagheshiro");
        Map<String, Double> hagheshiroMutations = Map.of(
                "Yotsujiro", 0.04);
        addPureBreedingRates(sampleBreedingRates, generatedCombinations, dictMap,
                List.of(dictMap.get("Hagheshiro")),
                0.8, hagheshiroPatterns,
                hagheshiroMutations);

        // 10. Hikari Muji x Hikari Muji
        List<String> hikariMujiPatterns = List.of(
                "Platinum Ogon", "Nezu Ogon", "Yamabuki Ogon",
                "Hi Ogon", "Orenji Ogon", "Mukashi Ogon");
        Map<String, Double> hikariMujiMutations = Map.of();
        addPureBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, hikariMujis, 0.9,
                hikariMujiPatterns,
                hikariMujiMutations);

        // 11. Ginrin x Ginrin
        List<String> ginrinPatterns = List.of(
                "Ginrin Kohaku", "Ginrin Sanke", "Kinrin Sanke", "Ginrin Showa", "Ginrin Shiro Utsuri",
                "Ginrin Hi Utsuri", "Ginrin Ki Utsuri", "Ginrin Asagi");
        Map<String, Double> ginrinMutations = Map.of();
        addPureBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, ginrins, 0.92, ginrinPatterns,
                ginrinMutations);

        /*
         * =============================================================================
         * ============
         * GROUP 3: OVERLAY BREEDING
         * =============================================================================
         * ============
         */
        // 1. Ginrin x Kohaku
        Map<String, Double> ginrinKohakuSubRates = Map.of(
                "Ginrin Kohaku", 0.3);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, ginrins, kohakus,
                BreedingRecipeType.OVERLAY, 0.3, 0.1,
                0.5,
                ginrinKohakuSubRates);

        // 2. Ginrin x Taisho Sanke
        Map<String, Double> ginrinTaishoSankeSubRates = Map.of(
                "Ginrin Sanke", 0.25);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, ginrins,
                taishoSankes,
                BreedingRecipeType.OVERLAY, 0.25, 0.1,
                0.5,
                ginrinTaishoSankeSubRates);

        // 3. Ginrin x Showa Sanshoku
        Map<String, Double> ginrinShowaSanshokuSubRates = Map.of(
                "Ginrin Showa", 0.25);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, ginrins,
                showaSanshokus,
                BreedingRecipeType.OVERLAY, 0.25, 0.1,
                0.55,
                ginrinShowaSanshokuSubRates);

        // 4. Ginrin x Utsuri
        Map<String, Double> ginrinUtsuriSubRates = Map.of(
                "Ginrin Shiro Utsuri", 0.25);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, ginrins, utsuris,
                BreedingRecipeType.OVERLAY, 0.25, 0.1,
                0.45,
                ginrinUtsuriSubRates);

        // 5. Ginrin x Hi Utsuri
        Map<String, Double> ginrinHiUtsuriSubRates = Map.of(
                "Ginrin Hi Utsuri", 0.25);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, ginrins,
                List.of(dictMap.get("Hi Utsuri")),
                BreedingRecipeType.OVERLAY, 0.25, 0.1,
                0.55,
                ginrinHiUtsuriSubRates);

        // 6. Ginrin x Ki Utsuri
        Map<String, Double> ginrinKiUtsuriSubRates = Map.of(
                "Ginrin Ki Utsuri", 0.25);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, ginrins,
                List.of(dictMap.get("Ki Utsuri")),
                BreedingRecipeType.OVERLAY, 0.25, 0.1,
                0.5,
                ginrinKiUtsuriSubRates);

        // 7. Hikari Muji x Utsuri
        Map<String, Double> hikariMujiUtsuriSubRates = Map.of(
                "Hikari Shiro Utsuri", 0.07,
                "Hi Utsuri", 0.07,
                "Ki Utsuri", 0.07);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, hikariMujis,
                utsuris,
                BreedingRecipeType.OVERLAY, 0.21, 0.25,
                0.39,
                hikariMujiUtsuriSubRates);

        // 8. Hikari Muji x Kohaku
        Map<String, Double> hikariMujiKohakuSubRates = Map.of(
                "Hariwake", 0.25);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, hikariMujis,
                kohakus,
                BreedingRecipeType.OVERLAY, 0.25, 0.2,
                0.4,
                hikariMujiKohakuSubRates);

        // 9. Hikari Muji x Taisho Sanke
        Map<String, Double> hikariMujiTaishoSankeSubRates = Map.of(
                "Yamato Nishiki", 0.2);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, hikariMujis,
                taishoSankes,
                BreedingRecipeType.OVERLAY, 0.2, 0.1,
                0.45,
                hikariMujiTaishoSankeSubRates);

        // 10. Hikari Muji x Showa Sanshoku
        Map<String, Double> hikariMujiShowaSanshokuSubRates = Map.of(
                "Ginrin Showa", 0.2);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, hikariMujis,
                showaSanshokus,
                BreedingRecipeType.OVERLAY, 0.2, 0.15,
                0.5,
                hikariMujiShowaSanshokuSubRates);

        // 11. Hikari Muji x Tancho
        Map<String, Double> hikariMujiTanchoSubRates = Map.of(
                "Tancho Hariwake", 0.15);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, hikariMujis,
                tanchos,
                BreedingRecipeType.OVERLAY, 0.15, 0.1,
                0.5,
                hikariMujiTanchoSubRates);

        // 12. Hikari Muji x Goromo
        Map<String, Double> hikariMujiGoromoSubRates = Map.of(
                "Kujaku", 0.15);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, hikariMujis,
                goromos,
                BreedingRecipeType.OVERLAY, 0.15, 0.15,
                0.45,
                hikariMujiGoromoSubRates);

        // 13. Hikari Muji x Shiro Bekko
        Map<String, Double> hikariMujiShiroBekkoSubRates = Map.of(
                "Ginrin Shiro Bekko", 0.2);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, hikariMujis,
                List.of(dictMap.get("Shiro Bekko")),
                BreedingRecipeType.OVERLAY, 0.2, 0.2,
                0.5,
                hikariMujiShiroBekkoSubRates);

        // 14. Hikari Muji x Aka Bekko
        Map<String, Double> hikariMujiAkaBekkoSubRates = Map.of(
                "Ginrin Aka Bekko", 0.2);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, hikariMujis,
                List.of(dictMap.get("Aka Bekko")),
                BreedingRecipeType.OVERLAY, 0.2, 0.2,
                0.5,
                hikariMujiAkaBekkoSubRates);

        // 15. Hikari Muji x Ki Bekko
        Map<String, Double> hikariMujiKiBekkoSubRates = Map.of(
                "Shusui", 0.1,
                "Hi Shusui", 0.1);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, hikariMujis,
                List.of(dictMap.get("Ki Bekko")),
                BreedingRecipeType.OVERLAY, 0.2, 0.2,
                0.5,
                hikariMujiKiBekkoSubRates);

        // 16. Hikari Muji x Asagi
        Map<String, Double> hikariMujiAsagiSubRates = Map.of(
                "Kujaku", 0.15);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, hikariMujis, asagis,
                BreedingRecipeType.OVERLAY, 0.15, 0.2,
                0.5,
                hikariMujiAsagiSubRates);

        // 17. Hikari Muji x Shusui
        Map<String, Double> hikariMujiShusuiSubRates = Map.of(
                "Shusui", 0.1,
                "Hi Shusui", 0.1);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, hikariMujis,
                shusuis,
                BreedingRecipeType.OVERLAY, 0.2, 0.2,
                0.5,
                hikariMujiShusuiSubRates);

        // 18. Hikari Muji x Goshiki
        Map<String, Double> hikariMujiGoshikiSubRates = Map.of(
                "Kujaku", 0.15);
        addCrossOrOverlayBreedingRates(sampleBreedingRates, generatedCombinations, dictMap, hikariMujis,
                goshikis,
                BreedingRecipeType.OVERLAY, 0.15, 0.2,
                0.4,
                hikariMujiGoshikiSubRates);

        breedingRateRepository.saveAll(sampleBreedingRates);
        System.out.println(">>> Seeded Breeding Rates Successfully");
    }

    /**
     * Helper generates crossbreeding matrix and cosmetic overlay (CROSS / OVERLAY)
     */
    private void addCrossOrOverlayBreedingRates(
            List<BreedingRate> rates,
            Set<String> generatedCombinations,
            Map<String, Dictionary> dictMap,
            List<Dictionary> fathers,
            List<Dictionary> mothers,
            BreedingRecipeType recipeType,
            double baseRate,
            double fatherRate,
            double motherRate,
            Map<String, Double> childSubRates) {

        BigDecimal normalizedFatherRate = BigDecimal.valueOf(fatherRate).setScale(4, RoundingMode.HALF_UP);
        BigDecimal normalizedMotherRate = BigDecimal.valueOf(fatherRate).setScale(4, RoundingMode.HALF_UP);
        BigDecimal swapFatherRate = normalizedFatherRate.multiply(BigDecimal.valueOf(0.25)).setScale(4,
                RoundingMode.HALF_UP);
        BigDecimal swapMotherRate = normalizedMotherRate.multiply(BigDecimal.valueOf(0.25)).setScale(4,
                RoundingMode.HALF_UP);

        for (Dictionary father : fathers) {
            for (Dictionary mother : mothers) {
                for (Map.Entry<String, Double> entry : childSubRates.entrySet()) {
                    Dictionary child = dictMap.get(entry.getKey());
                    if (child == null)
                        continue; // Skip if the data sample does not contain this koi

                    // Calculate actual rate: baseRate (e.g., 0.25) * subRate (e.g., 0.02) = 0.005
                    BigDecimal targetRate = BigDecimal.valueOf(entry.getValue())
                            .setScale(4,
                                    RoundingMode.HALF_UP);

                    // Calculate rate when swapping father and mother
                    BigDecimal swapTargetRate = targetRate.multiply(BigDecimal.valueOf(0.25))
                            .setScale(4,
                                    RoundingMode.HALF_UP);

                    // 1. Check and add case Father x Mother
                    String key1 = father.getName() + "|" + mother.getName() + "|" + child.getName();
                    if (!generatedCombinations.contains(key1)) {
                        generatedCombinations.add(key1);
                        rates.add(new BreedingRate(null, father, mother, child, recipeType,
                                targetRate,
                                normalizedFatherRate, normalizedMotherRate));
                    }

                    // 2. Check and add case Mother x Father (Swapped)
                    String key2 = mother.getName() + "|" + father.getName() + "|" + child.getName();
                    if (!generatedCombinations.contains(key2)) {
                        generatedCombinations.add(key2);
                        rates.add(new BreedingRate(null, mother, father, child, recipeType,
                                swapTargetRate,
                                swapFatherRate, swapMotherRate));
                    }
                }
            }
        }
    }

    /**
     * Helper generates same-line crossbreeding matrix (PURE).
     */
    private void addPureBreedingRates(
            List<BreedingRate> rates,
            Set<String> generatedCombinations,
            Map<String, Dictionary> dictMap,
            List<Dictionary> parents,
            double baseRate,
            List<String> normalPatterns,
            Map<String, Double> mutations) {
        double ratePerPattern = baseRate / normalPatterns.size();

        @SuppressWarnings("null")
        double totalMutationsRate = mutations.values().stream().reduce(Double.valueOf(0.0), Double::sum);
        double failureRate = 1 - (baseRate + totalMutationsRate);

        for (Dictionary father : parents) {
            for (Dictionary mother : parents) {
                // 1. Distribute rates evenly for basic patterns
                for (String patternName : normalPatterns) {
                    Dictionary child = dictMap.get(patternName);
                    if (child == null)
                        continue;

                    String key = father.getName() + "|" + mother.getName() + "|" + child.getName();
                    if (!generatedCombinations.contains(key)) {
                        generatedCombinations.add(key);
                        BigDecimal targetRate = BigDecimal.valueOf(ratePerPattern).setScale(4,
                                RoundingMode.HALF_UP);
                        rates.add(new BreedingRate(null, father, mother, child,
                                BreedingRecipeType.PURE, targetRate,
                                BigDecimal.valueOf(totalMutationsRate),
                                BigDecimal.valueOf(failureRate)));
                    }
                }

                // 2. Distribute rates for mutations
                for (Map.Entry<String, Double> entry : mutations.entrySet()) {
                    Dictionary child = dictMap.get(entry.getKey());
                    if (child == null)
                        continue;

                    String key = father.getName() + "|" + mother.getName() + "|" + child.getName();
                    if (!generatedCombinations.contains(key)) {
                        generatedCombinations.add(key);
                        BigDecimal targetRate = BigDecimal.valueOf(entry.getValue()).setScale(4,
                                RoundingMode.HALF_UP);
                        rates.add(new BreedingRate(null, father, mother, child,
                                BreedingRecipeType.PURE, targetRate,
                                BigDecimal.valueOf(totalMutationsRate),
                                BigDecimal.valueOf(failureRate)));
                    }
                }
            }
        }
    }
}
