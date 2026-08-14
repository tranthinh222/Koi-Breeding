package com.koibreeding.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class PaymentWebhookRequest {

    /** SePay transaction id. Stable across webhook retries/replays. */
    private Long id;

    /** "in" for money coming into our bank account. */
    private String transferType;

    /** Original bank transfer memo. */
    private String content;

    /** Payment code extracted by SePay, e.g. PAY1755151234567. */
    private String code;

    /** Incoming transfer amount in VND. */
    private Long transferAmount;

    private String referenceCode;
}
