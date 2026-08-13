package com.koibreeding.domain.response.home;

//import com.koibreeding.domain.response.home.NotificationSummary;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HomeResponse {

    private UserSummary user;
    private WalletSummary wallet;
    private PondSummary pond;
    private BreedingSummary breeding;
    private List<KoiSummary> featuredKoi;
    //private List<NotificationSummary> notifications;

}
