package com.koibreeding.controller;

import com.koibreeding.service.UploadService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UploadControllerTest {

    @Mock
    private UploadService uploadService;

    @InjectMocks
    private UploadController uploadController;

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
    void uploadAvatar_success() throws IOException {
        // GIVEN
        String url = "https://res.cloudinary.com/demo/avatars/avatar.png";
        when(uploadService.uploadImage(file, "uploads/avatars")).thenReturn(url);

        // WHEN
        ResponseEntity<?> result = uploadController.uploadAvatar(file);

        // THEN
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(Map.of("url", url), result.getBody());

        verify(uploadService).uploadImage(file, "uploads/avatars");
    }

    @Test
    void uploadAvatar_serviceThrowsIOException_shouldPropagate() throws IOException {
        // GIVEN
        when(uploadService.uploadImage(file, "uploads/avatars"))
                .thenThrow(new IOException("Cloudinary upload failed"));

        // WHEN + THEN
        IOException exception = assertThrows(
                IOException.class,
                () -> uploadController.uploadAvatar(file)
        );

        assertEquals("Cloudinary upload failed", exception.getMessage());
    }

    @Test
    void uploadItem_success() throws IOException {
        // GIVEN
        String url = "https://res.cloudinary.com/demo/items/food.png";
        when(uploadService.uploadImage(file, "uploads/items")).thenReturn(url);

        // WHEN
        ResponseEntity<?> result = uploadController.uploadItem(file);

        // THEN
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertNotNull(result.getBody());
        assertEquals(Map.of("url", url), result.getBody());

        verify(uploadService).uploadImage(file, "uploads/items");
    }

    @Test
    void uploadItem_serviceThrowsIOException_shouldPropagate() throws IOException {
        // GIVEN
        when(uploadService.uploadImage(file, "uploads/items"))
                .thenThrow(new IOException("Cloudinary upload failed"));

        // WHEN + THEN
        IOException exception = assertThrows(
                IOException.class,
                () -> uploadController.uploadItem(file)
        );

        assertEquals("Cloudinary upload failed", exception.getMessage());
    }
}