package com.koibreeding.domain;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "breeding_rate")
@Getter
@Setter
@NoArgsConstructor
public class BreedingRate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "father_id", nullable = false)
    private KoiDictionary father;

    @ManyToOne
    @JoinColumn(name = "mother_id", nullable = false)
    private KoiDictionary mother;

    @ManyToOne
    @JoinColumn(name = "child_id", nullable = false)
    private KoiDictionary child;

    @Column(nullable = false, precision = 4, scale = 2)
    private BigDecimal rate;
}
