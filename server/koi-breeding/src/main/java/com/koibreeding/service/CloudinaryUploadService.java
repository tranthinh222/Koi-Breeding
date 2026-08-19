package com.koibreeding.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class CloudinaryUploadService {
    
    private final Cloudinary cloudinary;

    public CloudinaryUploadService(Cloudinary cloudinary){
        this.cloudinary = cloudinary;
    }

    public String uploadImage(MultipartFile file) throws IOException{
        Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());

        return (String) result.get("secure_url");
    }
}