package com.koibreeding.domain;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "mutation")
@Getter
@Setter
@NoArgsConstructor
public class Mutation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, precision = 4, scale = 2)
    private BigDecimal rate;

    @Column(nullable = false, precision = 4, scale = 2)
    private BigDecimal value;

    @Column(columnDefinition = "TEXT")
    private String description;
}
