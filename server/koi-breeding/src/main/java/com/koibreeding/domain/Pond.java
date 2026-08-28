package com.koibreeding.domain;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "pond")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Pond {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String name;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false)
    private Integer level = 1;

    @Column(nullable = false, columnDefinition = "SMALLINT")
    private Integer capacity = 1;

    @Column(nullable = false, columnDefinition = "SMALLINT")
    private Integer waterQuality;

    @Column(nullable = false, precision = 4, scale = 1)
    private BigDecimal temperature;

    @Column(nullable = false, precision = 3, scale = 1)
    private BigDecimal pH;

    @Column(nullable = false, precision = 4, scale = 2)
    private BigDecimal oxygen;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(columnDefinition = "TEXT")
    private String description;
}
