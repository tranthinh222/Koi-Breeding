package com.koibreeding.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UploadServiceTest {

    @Mock
    private Cloudinary cloudinary;

    @Mock
    private Uploader uploader;

    @InjectMocks
    private UploadService uploadService;

    private MultipartFile file;

    @BeforeEach
    void initData() {
        file = new MockMultipartFile(
                "file",
                "avatar.png",
                "image/png",
                "fake-image-content".getBytes()
        );
    }

    @Test
    void uploadImage_success() throws IOException {
        // GIVEN
        Map<String, Object> cloudinaryResponse = Map.of(
                "secure_url", "https://res.cloudinary.com/demo/avatars/avatar.png"
        );

        when(cloudinary.uploader()).thenReturn(uploader);
        when(uploader.upload(any(byte[].class), anyMap())).thenReturn(cloudinaryResponse);

        // WHEN
        String result = uploadService.uploadImage(file, "uploads/avatars");

        // THEN
        assertEquals("https://res.cloudinary.com/demo/avatars/avatar.png", result);
        verify(uploader).upload(any(byte[].class), anyMap());
    }

    @Test
    void uploadImage_itemFolder_success() throws IOException {
        // GIVEN
        Map<String, Object> cloudinaryResponse = Map.of(
                "secure_url", "https://res.cloudinary.com/demo/items/food.png"
        );

        when(cloudinary.uploader()).thenReturn(uploader);
        when(uploader.upload(any(byte[].class), anyMap())).thenReturn(cloudinaryResponse);

        // WHEN
        String result = uploadService.uploadImage(file, "uploads/items");

        // THEN
        assertEquals("https://res.cloudinary.com/demo/items/food.png", result);
        verify(uploader).upload(any(byte[].class), anyMap());
    }

    @Test
    void uploadImage_uploader_shouldPropagate() throws IOException {
        // GIVEN
        when(cloudinary.uploader()).thenReturn(uploader);
        when(uploader.upload(any(byte[].class), anyMap()))
                .thenThrow(new IOException("Cloudinary upload failed"));

        // WHEN + THEN
        IOException exception = assertThrows(
                IOException.class,
                () -> uploadService.uploadImage(file, "uploads/avatars")
        );

        assertEquals("Cloudinary upload failed", exception.getMessage());
    }

    @Test
    void uploadImage_invalidFileBytes() throws IOException {
        // GIVEN
        MultipartFile brokenFile = mock(MultipartFile.class);
        when(brokenFile.getBytes()).thenThrow(new IOException("Cannot read file"));

        // WHEN + THEN
        IOException exception = assertThrows(
                IOException.class,
                () -> uploadService.uploadImage(brokenFile, "uploads/avatars")
        );

        assertEquals("Cannot read file", exception.getMessage());
    }
}