package com.koibreeding.domain;

import java.math.BigDecimal;

import com.koibreeding.enums.BreedingRecipeType;

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
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "breeding_rate")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BreedingRate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "father_id", nullable = false)
    private Dictionary father;

    @ManyToOne
    @JoinColumn(name = "mother_id", nullable = false)
    private Dictionary mother;

    @ManyToOne
    @JoinColumn(name = "child_id", nullable = false)
    private Dictionary child;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BreedingRecipeType type;

    @Column(nullable = false, precision = 4, scale = 2)
    private BigDecimal targetRate;

    @Column(nullable = false, precision = 4, scale = 2)
    private BigDecimal fatherRate;

    @Column(nullable = false, precision = 4, scale = 2)
    private BigDecimal motherRate;
}
