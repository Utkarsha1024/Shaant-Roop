package com.shaantroop.ecommerce.controller;

import com.shaantroop.ecommerce.dto.StoreSettingsDTO;
import com.shaantroop.ecommerce.service.StoreSettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/settings")
public class StoreSettingsAdminController {

    private final StoreSettingsService settingsService;

    public StoreSettingsAdminController(StoreSettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @PutMapping
    public ResponseEntity<StoreSettingsDTO> updateSettings(@RequestBody StoreSettingsDTO dto) {
        return ResponseEntity.ok(settingsService.updateSettings(dto));
    }
}
