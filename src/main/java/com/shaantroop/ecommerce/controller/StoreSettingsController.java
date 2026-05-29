package com.shaantroop.ecommerce.controller;

import com.shaantroop.ecommerce.dto.StoreSettingsDTO;
import com.shaantroop.ecommerce.service.StoreSettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class StoreSettingsController {

    private final StoreSettingsService settingsService;

    public StoreSettingsController(StoreSettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping("/payment")
    public ResponseEntity<StoreSettingsDTO> getPaymentSettings() {
        return ResponseEntity.ok(settingsService.getSettings());
    }
}
