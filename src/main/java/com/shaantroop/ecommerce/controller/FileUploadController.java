package com.shaantroop.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    public FileUploadController() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }

            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // ─── THE PRODUCTION FIX: Only save the relative path! ───
            String fileDownloadUri = "/uploads/" + uniqueFileName;

            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", fileDownloadUri);

            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().build();
        }
    }
}