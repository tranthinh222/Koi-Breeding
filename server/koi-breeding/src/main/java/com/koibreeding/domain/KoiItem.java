package com.koibreeding.domain;

import java.time.OffsetDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.koibreeding.domain.compositeId.KoiItemId;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "koi_item")
@Getter
@Setter
@NoArgsConstructor
public class KoiItem {
    @EmbeddedId
    private KoiItemId id;

    @ManyToOne
    @MapsId("koiId")
    @JoinColumn(name = "koi_id")
    private Koi koi;

    @ManyToOne
    @MapsId("itemId")
    @JoinColumn(name = "item_id")
    private Item item;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private OffsetDateTime usedAt;

    @Column(columnDefinition = "TEXT")
    private String description;
}