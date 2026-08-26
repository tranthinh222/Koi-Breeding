package com.koibreeding.dto.request;

import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReqBuyKoi {
    Integer sellerId;
    Integer koiId;
    Long price;
    Integer pondId;
}
