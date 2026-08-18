package com.koibreeding.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class VietQrService {

    @Value("${vietqr.bank-id}")
    private String bankId;

    @Value("${vietqr.account-no}")
    private String accountNo;

    @Value("${vietqr.account-name}")
    private String accountName;

    @Value("${vietqr.template:compact2}")
    private String template;

    public String generateQrUrl(long amount, String paymentContent) {

        return "https://img.vietqr.io/image/"
                + bankId
                + "-"
                + accountNo
                + "-"
                + template
                + ".png"
                + "?amount=" + amount
                + "&addInfo=" + encode(paymentContent)
                + "&accountName=" + encode(accountName);
    }

    private String encode(String value) {
        return URLEncoder.encode(
                value,
                StandardCharsets.UTF_8);
    }
}