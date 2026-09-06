package com.koibreeding.seeder;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.koibreeding.domain.Dictionary;
import com.koibreeding.domain.Variety;
import com.koibreeding.enums.ScaleType;
import com.koibreeding.enums.Shape;
import com.koibreeding.repository.DictionaryRepository;
import com.koibreeding.repository.VarietyRepository;

@Component
@Order(3)
public class DictionarySeeder implements CommandLineRunner {
    private DictionaryRepository dictionaryRepository;
    private VarietyRepository varietyRepository;

    public DictionarySeeder(DictionaryRepository dictionaryRepository, VarietyRepository varietyRepository) {
        this.dictionaryRepository = dictionaryRepository;
        this.varietyRepository = varietyRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (dictionaryRepository.count() > 0) {
            System.out.println(">>> Dictionaries already exist");
            return;
        }

        Map<String, Variety> currentVariety = varietyRepository.findAll().stream()
                .filter(Objects::nonNull)
                .filter(v -> v.getName() != null)
                .collect(Collectors.toMap(
                        v -> v.getName(),
                        item -> item,
                        (left, right) -> left,
                        LinkedHashMap::new));

        List<Dictionary> SAMPLE_DICTIONARIES = List.of(
                new Dictionary(null, "Kohaku", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Kohaku"), // 0
                        "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.015), 400,
                        BigDecimal.valueOf(0.000015), 100,
                        BigDecimal.valueOf(1.68),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787898045/uploads/dictionaries/p381ajo0i7lwby1gvkqq.svg"),
                new Dictionary(null, "Menkaburi Kohaku", Shape.STANDARD, ScaleType.WAGOI, // 1
                        currentVariety.get("Kohaku"), "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.015), 400,
                        BigDecimal.valueOf(0.000015), 110,
                        BigDecimal.valueOf(1.69),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787898119/uploads/dictionaries/ibnfkr5m6tet8l2x2utp.svg"),
                new Dictionary(null, "Kuchibeni Kohaku", Shape.STANDARD, ScaleType.WAGOI, // 2
                        currentVariety.get("Kohaku"), "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0149), 400,
                        BigDecimal.valueOf(0.000015), 120,
                        BigDecimal.valueOf(1.7),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787898300/uploads/dictionaries/jkfbq06ppchnygkxvpej.svg"),
                new Dictionary(null, "Inazuma Kohaku", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Kohaku"), // 3
                        "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.015), 400,
                        BigDecimal.valueOf(0.000015), 180,
                        BigDecimal.valueOf(1.75),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787898344/uploads/dictionaries/jnujyhexdmljzyzqukkj.svg"),
                new Dictionary(null, "Maruten Kohaku", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Kohaku"), // 4
                        "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0149), 400,
                        BigDecimal.valueOf(0.000015), 160,
                        BigDecimal.valueOf(1.74),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787898429/uploads/dictionaries/ejbovbwdfbmds8nluols.svg"),
                new Dictionary(null, "Straight Hi Kohaku", Shape.STANDARD, ScaleType.WAGOI, // 5
                        currentVariety.get("Kohaku"),
                        "Japan", BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0151), 400,
                        BigDecimal.valueOf(0.000015),
                        105, BigDecimal.valueOf(1.68),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787898538/uploads/dictionaries/ukcicocczf7f7egmoglb.svg"),
                new Dictionary(null, "Tancho Kohaku", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Kohaku"), // 6
                        "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0149), 400,
                        BigDecimal.valueOf(0.000015), 220,
                        BigDecimal.valueOf(1.9),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787898604/uploads/dictionaries/af9gaf2orqjfa7927kgx.svg"),
                new Dictionary(null, "Doitsu Kohaku", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Kohaku"), // 7
                        "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0152), 400,
                        BigDecimal.valueOf(0.000015), 150,
                        BigDecimal.valueOf(1.72),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787898646/uploads/dictionaries/rnhyzqphfma0qtjhrab2.svg"),
                new Dictionary(null, "Nidan Kohaku", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Kohaku"), // 8
                        "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.015), 400,
                        BigDecimal.valueOf(0.000015), 130,
                        BigDecimal.valueOf(1.7),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787898677/uploads/dictionaries/xjt0cj5kicxptcfpbifj.svg"),
                new Dictionary(null, "Ginrin Kohaku", Shape.STANDARD, ScaleType.GINRIN, currentVariety.get("Kohaku"), // 9
                        "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0148), 400,
                        BigDecimal.valueOf(0.000015), 170,
                        BigDecimal.valueOf(1.75),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787898705/uploads/dictionaries/lzxvv9y3tyni50av6mby.svg"),
                new Dictionary(null, "Tancho Sanke", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Tancho"), // 10
                        "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0145), 400,
                        BigDecimal.valueOf(0.000015), 240,
                        BigDecimal.valueOf(1.92),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787899056/uploads/dictionaries/juj4ofpndabjphbrokjz.svg"),
                new Dictionary(null, "Tancho Showa", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Tancho"), // 11
                        "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0138), 400,
                        BigDecimal.valueOf(0.000015), 260,
                        BigDecimal.valueOf(1.95),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787899107/uploads/dictionaries/dqw1timfyngdyiaurwkk.svg"),
                new Dictionary(null, "Yamato Nishiki", Shape.STANDARD, ScaleType.WAGOI,
                        currentVariety.get("Taisho Sanke"), // 12
                        "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.014), 410,
                        BigDecimal.valueOf(0.000015), 170,
                        BigDecimal.valueOf(1.78),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787899365/uploads/dictionaries/iz8e8xultvz6oxnfthbo.svg"),
                new Dictionary(null, "Kuchibeni Sanke", Shape.STANDARD, ScaleType.WAGOI, // 13
                        currentVariety.get("Taisho Sanke"), "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0142), 410,
                        BigDecimal.valueOf(0.000015), 140,
                        BigDecimal.valueOf(1.74),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787899402/uploads/dictionaries/bc0xghivgmimu12h5wba.svg"),
                new Dictionary(null, "Aka Sanke", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Taisho Sanke"), // 14
                        "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0145), 410,
                        BigDecimal.valueOf(0.000015), 130,
                        BigDecimal.valueOf(1.73),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787899437/uploads/dictionaries/ospjfrl2nhbo61kgkpc0.svg"),
                new Dictionary(null, "Subo Sumi Sanke", Shape.STANDARD, ScaleType.WAGOI, // 15
                        currentVariety.get("Taisho Sanke"), "Japan", BigDecimal.valueOf(90.0),
                        BigDecimal.valueOf(0.014), 410,
                        BigDecimal.valueOf(0.000015), 160, BigDecimal.valueOf(1.76),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787899477/uploads/dictionaries/p6uwsl3cy1i8yefrgadq.svg"),
                new Dictionary(null, "Maruten Sanke", Shape.STANDARD, ScaleType.WAGOI,
                        currentVariety.get("Taisho Sanke"), // 16
                        "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0141), 410,
                        BigDecimal.valueOf(0.000015), 170,
                        BigDecimal.valueOf(1.78),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787899518/uploads/dictionaries/rr3wo3hopya8fferjiez.svg"),
                new Dictionary(null, "Doitsu Sanke", Shape.STANDARD, ScaleType.DOITSU,
                        currentVariety.get("Taisho Sanke"), // 17
                        "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0144), 410,
                        BigDecimal.valueOf(0.000015), 160,
                        BigDecimal.valueOf(1.75),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787899555/uploads/dictionaries/gaitaapzpmnf0bmmhktj.svg"),
                new Dictionary(null, "Ginrin Sanke", Shape.STANDARD, ScaleType.GINRIN,
                        currentVariety.get("Taisho Sanke"), // 18
                        "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.014), 410,
                        BigDecimal.valueOf(0.000015), 190,
                        BigDecimal.valueOf(1.8),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787899584/uploads/dictionaries/ba4gblcqbab3rjgus8cj.svg"),
                new Dictionary(null, "Kinrin Sanke", Shape.STANDARD, ScaleType.GINRIN,
                        currentVariety.get("Taisho Sanke"), // 19
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.015), 410,
                        BigDecimal.valueOf(0.000015), 180,
                        BigDecimal.valueOf(1.72),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787903467/uploads/dictionaries/malnjw4fiwcsxgwby4jx.svg"),
                new Dictionary(null, "Showa Sanshoku", Shape.STANDARD, ScaleType.WAGOI,
                        currentVariety.get("Showa Sanshoku"), // 20
                        "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0135), 420,
                        BigDecimal.valueOf(0.000015), 130,
                        BigDecimal.valueOf(1.8),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787899615/uploads/dictionaries/ggykupod1phoymlyvrb8.svg"),
                new Dictionary(null, "Hi Showa", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Showa Sanshoku"), // 21
                        "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0136), 420,
                        BigDecimal.valueOf(0.000015), 140,
                        BigDecimal.valueOf(1.81),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787899660/uploads/dictionaries/n88suhutnaxhiprwcwcz.svg"),
                new Dictionary(null, "Kindai Showa", Shape.STANDARD, ScaleType.WAGOI,
                        currentVariety.get("Showa Sanshoku"), // 22
                        "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0134), 420,
                        BigDecimal.valueOf(0.000015), 170,
                        BigDecimal.valueOf(1.84),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787899705/uploads/dictionaries/e6jbgdmugxuik3rddl4f.svg"),
                new Dictionary(null, "Maruten Showa", Shape.STANDARD, ScaleType.WAGOI,
                        currentVariety.get("Showa Sanshoku"), // 23
                        "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0135), 420,
                        BigDecimal.valueOf(0.000015), 180,
                        BigDecimal.valueOf(1.85),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787899768/uploads/dictionaries/t1g3wcrcrd8hhy8ahp7c.svg"),
                new Dictionary(null, "Doitsu Showa", Shape.STANDARD, ScaleType.DOITSU,
                        currentVariety.get("Showa Sanshoku"), // 24
                        "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0138), 420,
                        BigDecimal.valueOf(0.000015), 170,
                        BigDecimal.valueOf(1.82),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787899800/uploads/dictionaries/nqlaswekxf3x3iss93mq.svg"),
                new Dictionary(null, "Ginrin Showa", Shape.STANDARD, ScaleType.GINRIN,
                        currentVariety.get("Showa Sanshoku"), // 25
                        "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0133), 420,
                        BigDecimal.valueOf(0.000015), 200,
                        BigDecimal.valueOf(1.88),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787899840/uploads/dictionaries/khyy1kqg9kns6vu4vqz3.svg"),
                new Dictionary(null, "Goromo", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Goromo"), // 26
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.014), 450,
                        BigDecimal.valueOf(0.000015), 170,
                        BigDecimal.valueOf(1.78),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787899897/uploads/dictionaries/iregklsuczak6fmdlhgd.svg"),
                new Dictionary(null, "Aigoromo", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Goromo"), // 27
                        "Japan", BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.014), 450,
                        BigDecimal.valueOf(0.000015),
                        180, BigDecimal.valueOf(1.8),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787899931/uploads/dictionaries/a3ximamc3alc9dph9bwx.svg"),
                new Dictionary(null, "Sumigoromo", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Goromo"), // 28
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0138), 450,
                        BigDecimal.valueOf(0.000015), 190,
                        BigDecimal.valueOf(1.82),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787899961/uploads/dictionaries/yxvwzwrkizzajdhj0pa8.svg"),
                new Dictionary(null, "Budo Koromo", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Goromo"), // 29
                        "Japan", BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0139), 450,
                        BigDecimal.valueOf(0.000015),
                        220, BigDecimal.valueOf(1.85),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787899987/uploads/dictionaries/rxdio1avdiuvhljhiubg.svg"),
                new Dictionary(null, "Koromo Showa", Shape.STANDARD, ScaleType.WAGOI, // 30
                        currentVariety.get("Goromo"), "Japan", BigDecimal.valueOf(85.0),
                        BigDecimal.valueOf(0.0135), 450,
                        BigDecimal.valueOf(0.000015), 240, BigDecimal.valueOf(1.88),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787900017/uploads/dictionaries/fvdlaoowtqobgvlicpwd.svg"),
                new Dictionary(null, "Ginrin Shiro Utsuri", Shape.STANDARD, ScaleType.GINRIN, // 31
                        currentVariety.get("Utsuri"),
                        "Japan", BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0136), 440,
                        BigDecimal.valueOf(0.000015),
                        210, BigDecimal.valueOf(1.84),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787900194/uploads/dictionaries/kmd1xlsc3npapxomia1f.svg"),
                new Dictionary(null, "Ginrin Hi Utsuri", Shape.STANDARD, ScaleType.GINRIN, // 32
                        currentVariety.get("Utsuri"), "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0134), 440,
                        BigDecimal.valueOf(0.000015), 220,
                        BigDecimal.valueOf(1.84),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787900223/uploads/dictionaries/dgdkjlgy0k57wvzdtrdp.svg"),
                new Dictionary(null, "Ginrin Ki Utsuri", Shape.STANDARD, ScaleType.GINRIN, // 33
                        currentVariety.get("Utsuri"), "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0133), 440,
                        BigDecimal.valueOf(0.000015), 280,
                        BigDecimal.valueOf(1.94),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787900252/uploads/dictionaries/mxfgfxqkxmyfccxtcre0.svg"),
                new Dictionary(null, "Shiro Utsuri Doitsu", Shape.STANDARD, ScaleType.DOITSU, // 34
                        currentVariety.get("Utsuri"),
                        "Japan", BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0138), 440,
                        BigDecimal.valueOf(0.000015),
                        230, BigDecimal.valueOf(1.88),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787900283/uploads/dictionaries/vgvmcxrsjqsioavxqui3.svg"),
                new Dictionary(null, "Hi Utsuri Doitsu", Shape.STANDARD, ScaleType.DOITSU, // 35
                        currentVariety.get("Utsuri"), "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0138), 440,
                        BigDecimal.valueOf(0.000015), 210,
                        BigDecimal.valueOf(1.82),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787900811/uploads/dictionaries/ig1lwiygluhqr7od8zkt.svg"),
                new Dictionary(null, "Ki Utsuri Doitsu", Shape.STANDARD, ScaleType.DOITSU, // 36
                        currentVariety.get("Utsuri"), "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0137), 440,
                        BigDecimal.valueOf(0.000015), 270,
                        BigDecimal.valueOf(1.92),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787900917/uploads/dictionaries/fdi319hkpjygxgbzwblw.svg"),
                new Dictionary(null, "Hikari Shiro Utsuri", Shape.STANDARD, ScaleType.WAGOI, // 37
                        currentVariety.get("Hikari Utsuri"),
                        "Japan", BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0137), 430,
                        BigDecimal.valueOf(0.000015),
                        240, BigDecimal.valueOf(1.86),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787900946/uploads/dictionaries/d4x32uepcneyfxrz45ub.svg"),
                new Dictionary(null, "Hi Utsuri", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Hikari Utsuri"), // 38
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0136), 430,
                        BigDecimal.valueOf(0.000015), 170,
                        BigDecimal.valueOf(1.78),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787900976/uploads/dictionaries/tt95bldzfliaok38k4do.svg"),
                new Dictionary(null, "Ki Utsuri", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Hikari Utsuri"), // 39
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0135), 430,
                        BigDecimal.valueOf(0.000015), 230,
                        BigDecimal.valueOf(1.9),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787901003/uploads/dictionaries/l2wuodfi49q9zmousydg.svg"),
                new Dictionary(null, "Shiro Bekko", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Bekko"), // 40
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0146), 440,
                        BigDecimal.valueOf(0.000015), 130,
                        BigDecimal.valueOf(1.68),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787901030/uploads/dictionaries/ci8v5vdzcalg5wbgo1hc.svg"),
                new Dictionary(null, "Ginrin Shiro Bekko", Shape.STANDARD, ScaleType.GINRIN,
                        currentVariety.get("Bekko"), // 41
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0147), 440,
                        BigDecimal.valueOf(0.000015), 150,
                        BigDecimal.valueOf(1.69),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1788633456/uploads/dictionaries/l7zy6oeujbbhsuweivor.svg"),
                new Dictionary(null, "Aka Bekko", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Bekko"), // 42
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0145), 430,
                        BigDecimal.valueOf(0.000015), 150,
                        BigDecimal.valueOf(1.72),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787901061/uploads/dictionaries/b3kyxdokrlzujfjc912j.svg"),
                new Dictionary(null, "Ginrin Aka Bekko", Shape.STANDARD, ScaleType.GINRIN, currentVariety.get("Bekko"), // 43
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0145), 430,
                        BigDecimal.valueOf(0.000015), 170,
                        BigDecimal.valueOf(1.74),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1788633499/uploads/dictionaries/s7ftdr5chnrxucjo4ggg.svg"),
                new Dictionary(null, "Ki Bekko", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Bekko"), // 44
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0144), 430,
                        BigDecimal.valueOf(0.000015), 190,
                        BigDecimal.valueOf(1.82),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787901090/uploads/dictionaries/gaz6h19mrcbrl8oncxyl.svg"),
                new Dictionary(null, "Karashi", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Karashi"), // 45
                        "Japan",
                        BigDecimal.valueOf(100.0), BigDecimal.valueOf(0.0185), 320,
                        BigDecimal.valueOf(0.000017), 180,
                        BigDecimal.valueOf(1.56),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787901118/uploads/dictionaries/csxq3tokhy6ttjhefwuy.svg"),
                new Dictionary(null, "Benigoi", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Benigoi"), // 46
                        "Japan",
                        BigDecimal.valueOf(95.0), BigDecimal.valueOf(0.0175), 330,
                        BigDecimal.valueOf(0.000017), 130,
                        BigDecimal.valueOf(1.58),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787901177/uploads/dictionaries/nqe2f8a5bwecrv4s8t33.svg"),
                new Dictionary(null, "Chagoi", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Chagoi"), // 47
                        "Japan",
                        BigDecimal.valueOf(100.0), BigDecimal.valueOf(0.019), 300,
                        BigDecimal.valueOf(0.000018), 150,
                        BigDecimal.valueOf(1.5),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787902455/uploads/dictionaries/dulmt3mgxhmqcc1fphb6.png"),
                new Dictionary(null, "Midorigoi", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Chagoi"), // 48
                        "Japan",
                        BigDecimal.valueOf(100.0), BigDecimal.valueOf(0.017), 300,
                        BigDecimal.valueOf(0.000017), 280,
                        BigDecimal.valueOf(1.9),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787902487/uploads/dictionaries/flxmjflbnzk2jyxrediy.svg"),
                new Dictionary(null, "Soragoi", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Chagoi"), // 49
                        "Japan",
                        BigDecimal.valueOf(100.0), BigDecimal.valueOf(0.0185), 300,
                        BigDecimal.valueOf(0.000018), 160,
                        BigDecimal.valueOf(1.55),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787903021/uploads/dictionaries/snvqnlhd2ihi6rqheqb4.png"),
                new Dictionary(null, "Platinum Ogon", Shape.STANDARD, ScaleType.WAGOI,
                        currentVariety.get("Hikari Muji"), // 50
                        "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0162), 360,
                        BigDecimal.valueOf(0.000016), 170,
                        BigDecimal.valueOf(1.66),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787903110/uploads/dictionaries/u0vaxmss6nzwpps7nkwl.png"),
                new Dictionary(null, "Yamabuki Ogon", Shape.STANDARD, ScaleType.WAGOI,
                        currentVariety.get("Hikari Muji"), // 51
                        "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0168), 360,
                        BigDecimal.valueOf(0.000017), 180,
                        BigDecimal.valueOf(1.64),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787903136/uploads/dictionaries/tw9dylh415cmyrkerbya.png"),
                new Dictionary(null, "Hi Ogon", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Hikari Muji"), // 52
                        "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0163), 360,
                        BigDecimal.valueOf(0.000016), 170,
                        BigDecimal.valueOf(1.66),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787903166/uploads/dictionaries/ponhmaxw6wmm4dwjkejt.png"),
                new Dictionary(null, "Orenji Ogon", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Hikari Muji"), // 53
                        "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0162), 360,
                        BigDecimal.valueOf(0.000016), 170,
                        BigDecimal.valueOf(1.66),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787903185/uploads/dictionaries/z3ppxj1mrjtueu18bxbp.png"),
                new Dictionary(null, "Mukashi Ogon", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Hikari Muji"), // 54
                        "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0158), 360,
                        BigDecimal.valueOf(0.000016), 200,
                        BigDecimal.valueOf(1.72),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787903220/uploads/dictionaries/vhhlcrfzqj2mfgphevdy.png"),
                new Dictionary(null, "Nezu Ogon", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Hikari Muji"), // 55
                        "Japan",
                        BigDecimal.valueOf(90.0), BigDecimal.valueOf(0.0158), 360,
                        BigDecimal.valueOf(0.000016), 170,
                        BigDecimal.valueOf(1.65),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787903259/uploads/dictionaries/acnfhv3ukjnywsd8fyf0.png"),
                new Dictionary(null, "Konjo Asagi", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Asagi"), // 56
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0148), 480,
                        BigDecimal.valueOf(0.000015), 180,
                        BigDecimal.valueOf(1.74),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787903283/uploads/dictionaries/xt8zqqxntlp1rky1vxaq.png"),
                new Dictionary(null, "Narumi Asagi", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Asagi"), // 57
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0149), 480,
                        BigDecimal.valueOf(0.000015), 170,
                        BigDecimal.valueOf(1.72),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787903303/uploads/dictionaries/e4twvjv0cccbu8scyocp.png"),
                new Dictionary(null, "Mizo Asagi", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Asagi"), // 58
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0148), 480,
                        BigDecimal.valueOf(0.000015), 190,
                        BigDecimal.valueOf(1.75),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787903324/uploads/dictionaries/f5axcdbeduuutpkhwkid.png"),
                new Dictionary(null, "Ginrin Asagi", Shape.STANDARD, ScaleType.GINRIN, currentVariety.get("Asagi"), // 59
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0148), 480,
                        BigDecimal.valueOf(0.000015), 220,
                        BigDecimal.valueOf(1.82),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787903345/uploads/dictionaries/zvsewloto1dv4brgghti.png"),
                new Dictionary(null, "Shusui", Shape.STANDARD, ScaleType.DOITSU, currentVariety.get("Shusui"), // 60
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0152), 470,
                        BigDecimal.valueOf(0.000015), 200,
                        BigDecimal.valueOf(1.78),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787903367/uploads/dictionaries/dproinwk2prnzgjorzwv.svg"),
                new Dictionary(null, "Hi Shusui", Shape.STANDARD, ScaleType.DOITSU, currentVariety.get("Shusui"), // 61
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0151), 480,
                        BigDecimal.valueOf(0.000015), 210,
                        BigDecimal.valueOf(1.8),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787903393/uploads/dictionaries/miluvpms5r81kpnjye31.svg"),
                new Dictionary(null, "Goshiki", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Goshiki"), // 62
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.014), 460,
                        BigDecimal.valueOf(0.000015), 220,
                        BigDecimal.valueOf(1.88),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787903416/uploads/dictionaries/urpiuthqimzafaj6gdtn.svg"),
                new Dictionary(null, "Modern Goshiki", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Goshiki"), // 63
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.014), 460,
                        BigDecimal.valueOf(0.000015), 220,
                        BigDecimal.valueOf(1.88),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1788615431/uploads/dictionaries/hf8g4b67b5nw4daxnk4k.svg"),
                new Dictionary(null, "Hariwake", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Hikarimoyo"), // 64
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0158), 420,
                        BigDecimal.valueOf(0.000016), 210,
                        BigDecimal.valueOf(1.8),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787903492/uploads/dictionaries/ul8pcjrrvpjy9e2nfucu.svg"),
                new Dictionary(null, "Tancho Hariwake", Shape.STANDARD, ScaleType.WAGOI,
                        currentVariety.get("Hikarimoyo"), // 65
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.016), 420,
                        BigDecimal.valueOf(0.000016), 220,
                        BigDecimal.valueOf(1.81),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1788631169/uploads/dictionaries/ytupmpikb8b34ropiswx.svg"),
                new Dictionary(null, "Kujaku", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Hikarimoyo"), // 66
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0152), 420,
                        BigDecimal.valueOf(0.000016), 250,
                        BigDecimal.valueOf(1.92),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787904705/uploads/dictionaries/qogkvubzeukheb9dyimp.png"),
                new Dictionary(null, "Kikusui", Shape.STANDARD, ScaleType.DOITSU, currentVariety.get("Hikarimoyo"), // 67
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0154), 420,
                        BigDecimal.valueOf(0.000015), 240,
                        BigDecimal.valueOf(1.9),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787904733/uploads/dictionaries/fzqkchyzldvpypdiwrfm.svg"),
                new Dictionary(null, "Magoi", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Kawarimono"), // 68
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.02), 420,
                        BigDecimal.valueOf(0.000018), 320,
                        BigDecimal.valueOf(1.52),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787904821/uploads/dictionaries/rhglygdq8dywjnbibbh4.png"),
                new Dictionary(null, "Tea Chagoi", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Kawarimono"), // 69
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.019), 420,
                        BigDecimal.valueOf(0.000018), 150,
                        BigDecimal.valueOf(1.5),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787904846/uploads/dictionaries/ipqjgxmepfcruhxzeoti.png"),
                new Dictionary(null, "Kigoi", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Kawarimono"), // 70
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0165), 420,
                        BigDecimal.valueOf(0.000017), 260,
                        BigDecimal.valueOf(1.86),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787904867/uploads/dictionaries/r7os7gocywkipuwlwcmy.png"),
                new Dictionary(null, "Karasugoi", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Kawarimono"), // 71
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.018), 420,
                        BigDecimal.valueOf(0.000017), 140,
                        BigDecimal.valueOf(1.65),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787904893/uploads/dictionaries/pcyurf3horhslbo3fg7y.png"),
                new Dictionary(null, "Hajiro", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Kawarimono"), // 72
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.018), 420,
                        BigDecimal.valueOf(0.000017), 150,
                        BigDecimal.valueOf(1.66),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1788621548/uploads/dictionaries/urzszby60fwr65ehnd2w.png"),
                new Dictionary(null, "Hagheshiro", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Kawarimono"), // 73
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.014), 420,
                        BigDecimal.valueOf(0.000015), 300,
                        BigDecimal.valueOf(1.94),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787904916/uploads/dictionaries/ccqn2o69v62kaa39hr2l.png"),
                new Dictionary(null, "Yotsujiro", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Kawarimono"), // 74
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0143), 420,
                        BigDecimal.valueOf(0.000015), 270,
                        BigDecimal.valueOf(1.9),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787904939/uploads/dictionaries/ipheynqxkzudvq1os834.png"),
                new Dictionary(null, "Aka Matsuba", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Kawarimono"), // 75
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0155), 420,
                        BigDecimal.valueOf(0.000015), 190,
                        BigDecimal.valueOf(1.76),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787904961/uploads/dictionaries/vot1fzqzxq33r3xtoft1.png"),
                new Dictionary(null, "Ki Matsuba", Shape.STANDARD, ScaleType.WAGOI, currentVariety.get("Kawarimono"), // 76
                        "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0154), 420,
                        BigDecimal.valueOf(0.000015), 210,
                        BigDecimal.valueOf(1.78),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787904979/uploads/dictionaries/wpo6jrxoyukgpptiidiw.png"),
                new Dictionary(null, "Ochiba Shigure", Shape.STANDARD, ScaleType.WAGOI, // 77
                        currentVariety.get("Kawarimono"), "Japan",
                        BigDecimal.valueOf(85.0), BigDecimal.valueOf(0.0178), 420,
                        BigDecimal.valueOf(0.000017), 180,
                        BigDecimal.valueOf(1.6),
                        "https://res.cloudinary.com/djmcluh5n/image/upload/v1787905000/uploads/dictionaries/wkzxkvhmh0i86segqsag.svg"));

        dictionaryRepository.saveAll(SAMPLE_DICTIONARIES);
        System.out.println(">>> Seeded Dictionaries Successfully");
    }

}
