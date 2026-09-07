package com.koibreeding.domain;

import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.koibreeding.enums.BreedingStatus;
import com.koibreeding.enums.BreedingType;

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
@Table(name = "breeding_event")
@Getter
@Setter
@NoArgsConstructor
public class BreedingEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "male_id", nullable = false)
    private Koi male;

    @ManyToOne
    @JoinColumn(name = "female_id", nullable = false)
    private Koi female;

    @ManyToOne
    @JoinColumn(name = "pond_id", nullable = false)
    private Pond pond;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BreedingType breedingType;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime startedAt;

    @Column(nullable = false)
    private OffsetDateTime expectedHatchDate;

    private OffsetDateTime endedAt;

    @Column(nullable = false)
    private Integer expectedEggCount = 0;

    @Column(nullable = false)
    private Boolean offspringGenerated = false;

    private OffsetDateTime lastReminderAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BreedingStatus status = BreedingStatus.STARTED;
}
