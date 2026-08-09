package com.koibreeding.domain.compositeId;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.io.Serializable;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class KoiItemId implements Serializable {
    private Integer koiId;
    private Integer itemId;
}
