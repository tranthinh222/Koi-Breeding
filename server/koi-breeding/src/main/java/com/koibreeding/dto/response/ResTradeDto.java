package com.koibreeding.dto.response;

import com.koibreeding.domain.Marketplace;
import com.koibreeding.domain.User;
import lombok.*;

import java.time.OffsetDateTime;

@Setter
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResTradeDto {
     Integer listing;
     Integer buyer;
     Integer seller;
     Long price;
     OffsetDateTime tradeAt;
}
