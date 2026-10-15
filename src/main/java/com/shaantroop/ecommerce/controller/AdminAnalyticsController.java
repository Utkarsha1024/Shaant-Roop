package com.shaantroop.ecommerce.controller;

import com.shaantroop.ecommerce.dto.DashboardStatsResponseDTO;
import com.shaantroop.ecommerce.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminAnalyticsController {

    private final AnalyticsService analyticsService;

    public AdminAnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponseDTO> getDashboardStats() {
        return ResponseEntity.ok(analyticsService.getDashboardStats());
    }
}
