package com.koibreeding.controller;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.koibreeding.service.UploadService;
import com.koibreeding.util.annotation.ApiMessage;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class UploadController {

    private final UploadService uploadService;

    @PostMapping("/upload/avatar")
    @ApiMessage("upload avatar")
    public ResponseEntity<?> uploadAvatar(
            @RequestParam("file") MultipartFile file) throws IOException {

        String url = uploadService.uploadImage(file, "uploads/avatars");

        return ResponseEntity.ok(Map.of("url", url));
    }

    @PostMapping("/upload/item")
    @ApiMessage("upload item image")
    public ResponseEntity<?> uploadItem(
            @RequestParam("file") MultipartFile file) throws IOException {

        String url = uploadService.uploadImage(file, "uploads/items");

        return ResponseEntity.ok(Map.of("url", url));
    }

    @PostMapping("/upload/dictionary")
    @ApiMessage("upload koi varient's image")
    public ResponseEntity<?> uploadDictionaryImage(
            @RequestParam("file") MultipartFile file) throws IOException {
        String url = uploadService.uploadImage(file, "uploads/dictionaries");

        return ResponseEntity.ok(Map.of("url", url));
    }

}