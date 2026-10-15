package com.shaantroop.ecommerce.controller;

import com.shaantroop.ecommerce.service.FileCleanupService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/system")
public class AdminSystemController {

    private final FileCleanupService fileCleanupService;

    public AdminSystemController(FileCleanupService fileCleanupService) {
        this.fileCleanupService = fileCleanupService;
    }

    @PostMapping("/cleanup-images")
    public ResponseEntity<Map<String, Object>> cleanupImages() {
        int deletedCount = fileCleanupService.cleanupOrphanedImages();
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Image cleanup completed successfully.");
        response.put("deletedCount", deletedCount);
        
        return ResponseEntity.ok(response);
    }
}
