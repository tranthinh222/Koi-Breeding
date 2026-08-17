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
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "dictionary")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Dictionary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Name cannot be blank")
    @Size(max = 100, message = "Maximum name's length is 100 characters")
    @Column(unique = true, nullable = false, length = 100)
    private String name;

    @NotNull(message = "Shape cannot be null")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Shape shape;

    @NotNull(message = "Scale Type cannot be null")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScaleType scaleType;

    @NotNull(message = "Variety cannot be null")
    @ManyToOne
    @JoinColumn(name = "variety_id", nullable = false)
    private Variety variety;

    @NotBlank(message = "Origin cannot be blank")
    @Size(max = 100, message = "Maximum origin's length is 100 characters")
    @Column(nullable = false, length = 100)
    private String origin;

    @Positive(message = "Base Max Length must be positive")
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal baseMaxLength;

    @DecimalMin(value = "0.01", message = "Base Growth Rate must be in range 0.01 ~ 0.02")
    @DecimalMax(value = "0.02", message = "Base Growth Rate must be in range 0.01 ~ 0.02")
    @Column(nullable = false, precision = 5, scale = 4)
    private BigDecimal baseGrowthRate;

    @Positive(message = "Mid Age must be a positive integer")
    @Column(nullable = false, columnDefinition = "SMALLINT")
    private Integer midAge;

    @DecimalMin(value = "0.00001", message = "Alpha Weight must be in range 0.00001 ~ 0.00002")
    @DecimalMax(value = "0.00002", message = "Alpha Weight must be in range 0.00001 ~ 0.00002")
    @Column(nullable = false, precision = 8, scale = 7)
    private BigDecimal alphaWeight;

    @Positive(message = "Base Price must be a positive integer")
    @Column(nullable = false, columnDefinition = "SMALLINT")
    private Integer basePrice;

    @DecimalMin(value = "1.5", message = "Alpha Price must be in range 1.5 ~ 2.0")
    @DecimalMax(value = "2.0", message = "Alpha Price must be in range 1.5 ~ 2.0")
    @Column(nullable = false, precision = 3, scale = 2)
    private BigDecimal alphaPrice;
}
