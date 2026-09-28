package com.koibreeding.exception;

import com.koibreeding.dto.RestResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<RestResponse<Object>> handleResponseStatusException(ResponseStatusException ex) {
        RestResponse<Object> response = RestResponse.<Object>builder()
                .statusCode(ex.getStatusCode().value())
                .message(ex.getReason())
                .data(null)
                .build();

        return ResponseEntity.status(ex.getStatusCode()).headers(ex.getHeaders()).body(response);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<RestResponse<Object>> handleRuntimeException(RuntimeException ex) {

         RestResponse<Object> response = RestResponse.builder()
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .message(ex.getMessage())
                .data(null)
                .build();

         return ResponseEntity.status(HttpStatus.BAD_REQUEST.value()).body(response);
    }

}
