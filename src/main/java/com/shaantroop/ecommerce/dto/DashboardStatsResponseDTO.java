package com.shaantroop.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponseDTO {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SalesData {
        private String date; // String format for easy JSON parsing
        private BigDecimal revenue;
    }

    private BigDecimal totalRevenue;
    private Long totalOrders;
    private Long activeUsers;
    private Long totalProducts;
    private Long totalCategories;

    private List<SalesData> salesOverTime;
    private Map<String, Integer> ageDemographics;
    private Map<String, Integer> stateDistribution;
    private List<CategoryMetricDTO> categoryMetrics;
    private List<TopSellingProductDTO> topSellingProducts;
}
