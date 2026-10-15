package com.shaantroop.ecommerce.service;

import com.shaantroop.ecommerce.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class FileCleanupService {

    private final ProductRepository productRepository;
    private final Path uploadDir;

    public FileCleanupService(ProductRepository productRepository) {
        this.productRepository = productRepository;
        this.uploadDir = Paths.get("uploads");
    }

    public int cleanupOrphanedImages() {
        File folder = uploadDir.toFile();
        if (!folder.exists() || !folder.isDirectory()) {
            return 0;
        }

        List<String> databaseUrls = productRepository.findAllImageUrls();
        Set<String> databaseFilenames = databaseUrls.stream()
                .map(url -> url.substring(url.lastIndexOf("/") + 1))
                .collect(Collectors.toSet());

        File[] files = folder.listFiles();
        if (files == null) {
            return 0;
        }

        int deletedCount = 0;
        for (File file : files) {
            if (file.isFile() && !databaseFilenames.contains(file.getName())) {
                if (file.delete()) {
                    deletedCount++;
                }
            }
        }

        return deletedCount;
    }
}
