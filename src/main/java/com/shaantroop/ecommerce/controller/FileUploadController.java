package com.shaantroop.ecommerce.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {

    /** Only these MIME types are accepted for product images. */
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
            "image/jpeg",
            "image/png",
            "image/webp"
    );

    /** Extensions that must always be rejected, regardless of MIME type. */
    private static final Set<String> BLOCKED_EXTENSIONS = Set.of(
            ".html", ".htm", ".svg", ".xml", ".js", ".php", ".jsp"
    );

    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    public FileUploadController() {
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException(
                    "Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            // ── 1. Validate MIME type ────────────────────────────────────────
            String contentType = file.getContentType();
            if (contentType == null || !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
                return ResponseEntity.badRequest().body(
                        Map.of("error", "Invalid file type. Only JPEG, PNG, and WebP images are allowed."));
            }

            // ── 2. Validate file extension ───────────────────────────────────
            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf(".")).toLowerCase();
            }

            if (BLOCKED_EXTENSIONS.contains(fileExtension)) {
                return ResponseEntity.badRequest().body(
                        Map.of("error", "File extension '" + fileExtension + "' is not allowed."));
            }

            // ── 3. Force a safe extension derived from the MIME type ─────────
            // This prevents any extension spoofing: even if the original file
            // was named "exploit.php.jpg", we discard the original extension
            // entirely and derive one from the validated content type.
            String safeExtension = switch (contentType.toLowerCase()) {
                case "image/jpeg" -> ".jpg";
                case "image/png"  -> ".png";
                case "image/webp" -> ".webp";
                default           -> "";
            };

            String uniqueFileName = UUID.randomUUID().toString() + safeExtension;
            Path targetLocation = this.fileStorageLocation.resolve(uniqueFileName).normalize();

            // ── 4. Guard against path traversal ──────────────────────────────
            if (!targetLocation.startsWith(this.fileStorageLocation)) {
                return ResponseEntity.badRequest().body(
                        Map.of("error", "Invalid file path."));
            }

            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Only save the relative path
            String fileDownloadUri = "/uploads/" + uniqueFileName;

            Map<String, String> response = new HashMap<>();
            response.put("imageUrl", fileDownloadUri);

            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
