package com.koibreeding.domain;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.koibreeding.enums.Gender;
import com.koibreeding.enums.LifeStage;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "koi")
@Getter
@Setter
@NoArgsConstructor
public class Koi {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private Integer age;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Gender gender;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal length;

    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal weight;

    @Column(nullable = false, columnDefinition = "SMALLINT")
    private Integer health = 100;

    @Column(nullable = false, columnDefinition = "SMALLINT")
    private Integer foodBar = 100;

    @Column(nullable = false)
    private Integer price;

    @ManyToOne
    @JoinColumn(name = "mutation_id")
    private Mutation mutation;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime bornedAt;

    @ManyToOne
    @JoinColumn(name = "pond_id", nullable = false)
    private Pond pond;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LifeStage lifeStage = LifeStage.EGG;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "father_id")
    private Koi father;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "mother_id")
    private Koi mother;

    @Column(nullable = false, precision = 3, scale = 2)
    private BigDecimal potential = BigDecimal.ZERO;

    @ManyToOne
    @JoinColumn(name = "dictionary_id", nullable = false)
    private Dictionary dictionary;

    @Column(nullable = false)
    private Integer patternScore = 0;

    @Column(nullable = false)
    private Integer colorScore = 0;

    @Column(nullable = false)
    private Integer bodyScore = 0;

    @Column(nullable = false)
    private Integer skinScore = 0;

    @Column(nullable = false)
    private Integer scaleScore = 0;
}
