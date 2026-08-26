package com.koibreeding.dto.request;

import lombok.*;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReqMarketDeleteKoi {
    Integer userId;
    Integer koiId;
}
