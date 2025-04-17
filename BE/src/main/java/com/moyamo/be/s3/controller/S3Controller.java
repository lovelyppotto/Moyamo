package com.moyamo.be.s3.controller;

import com.moyamo.be.s3.service.S3Service;
import com.moyamo.be.s3.dto.FileUploadResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/s3")
@RequiredArgsConstructor
public class S3Controller {

    private final S3Service s3Service;

    // ✅ 파일 업로드 API
    @PostMapping("/upload")
    public ResponseEntity<FileUploadResponse> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileUrl = s3Service.uploadFile(file);
            return ResponseEntity.ok(new FileUploadResponse(fileUrl));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(new FileUploadResponse("파일 업로드 실패: " + e.getMessage()));
        }
    }
}
