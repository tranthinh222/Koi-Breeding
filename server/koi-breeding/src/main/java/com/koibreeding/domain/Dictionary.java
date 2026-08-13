package com.koibreeding.domain;

import java.math.BigDecimal;

import com.koibreeding.enums.ScaleType;
import com.koibreeding.enums.Shape;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "koi_dictionary")
@Getter
@Setter
@NoArgsConstructor
public class Dictionary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Shape shape;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScaleType scaleType;

    @ManyToOne
    @JoinColumn(name = "variety_id", nullable = false)
    private Variety variety;

    @Column(nullable = false, length = 100)
    private String origin;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal baseMaxLength;

    @Column(nullable = false, precision = 5, scale = 4)
    private BigDecimal baseGrowthRate;

    @Column(nullable = false)
    private Integer midAge;

    @Column(nullable = false, precision = 8, scale = 7)
    private BigDecimal alphaWeight;

    @Column(nullable = false)
    private Integer basePrice;

    @Column(nullable = false, precision = 3, scale = 2)
    private BigDecimal alphaPrice;
}
