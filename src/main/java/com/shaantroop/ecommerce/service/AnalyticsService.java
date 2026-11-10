package com.shaantroop.ecommerce.service;

import com.shaantroop.ecommerce.dto.DashboardStatsResponseDTO;
import com.shaantroop.ecommerce.dto.SalesDataPoint;

import com.shaantroop.ecommerce.repository.CategoryRepository;
import com.shaantroop.ecommerce.repository.OrderRepository;
import com.shaantroop.ecommerce.repository.ProductRepository;
import com.shaantroop.ecommerce.repository.UserProfileRepository;
import com.shaantroop.ecommerce.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.Period;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.math.BigDecimal;

@Service
public class AnalyticsService {

    private final OrderRepository orderRepository;
    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public AnalyticsService(OrderRepository orderRepository,
            UserProfileRepository userProfileRepository,
            UserRepository userRepository,
            ProductRepository productRepository,
            CategoryRepository categoryRepository) {
        this.orderRepository = orderRepository;
        this.userProfileRepository = userProfileRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public DashboardStatsResponseDTO getDashboardStats() {
        List<DashboardStatsResponseDTO.SalesData> salesOverTime = getSalesOverTime();

        BigDecimal totalRevenue = salesOverTime.stream()
                .map(data -> data.getRevenue() != null ? data.getRevenue() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, (a, b) -> a.add(b));

        return DashboardStatsResponseDTO.builder()
                .totalRevenue(totalRevenue)
                .totalOrders(orderRepository.count())
                .activeUsers(userRepository.count())
                .totalProducts(productRepository.count())
                .totalCategories(categoryRepository.count())
                .salesOverTime(salesOverTime)
                .ageDemographics(getAgeDemographics())
                .stateDistribution(getStateDistribution())
                .categoryMetrics(categoryRepository.getCategoryMetrics())
                .topSellingProducts(orderRepository.getTopSellingProducts())
                .build();
    }

    private List<DashboardStatsResponseDTO.SalesData> getSalesOverTime() {
        List<SalesDataPoint> points = orderRepository.getSalesOverTime();
        return points.stream()
                .map(p -> new DashboardStatsResponseDTO.SalesData(
                        p.getOrderDate() != null ? p.getOrderDate().toString() : "",
                        p.getTotalRevenue() != null ? p.getTotalRevenue() : BigDecimal.ZERO))
                .collect(Collectors.toList());
    }

    private Map<String, Integer> getAgeDemographics() {
        List<LocalDate> dobs = userProfileRepository.findAllDateOfBirths();
        Map<String, Integer> demographics = new HashMap<>();

        // Initialize buckets
        demographics.put("Under 21", 0);
        demographics.put("21-30", 0);
        demographics.put("31-40", 0);
        demographics.put("41+", 0);

        LocalDate now = LocalDate.now();

        for (LocalDate dob : dobs) {
            int age = Period.between(dob, now).getYears();
            if (age < 21) {
                demographics.put("Under 21", demographics.get("Under 21") + 1);
            } else if (age <= 30) {
                demographics.put("21-30", demographics.get("21-30") + 1);
            } else if (age <= 40) {
                demographics.put("31-40", demographics.get("31-40") + 1);
            } else {
                demographics.put("41+", demographics.get("41+") + 1);
            }
        }

        return demographics;
    }

    private Map<String, Integer> getStateDistribution() {
        List<String> addresses = orderRepository.findAllShippingAddresses();
        Map<String, Integer> stateCounts = new HashMap<>();

        for (String address : addresses) {
            String state = extractStateFromAddress(address);
            if (state != null && !state.isBlank()) {
                state = state.trim().toUpperCase();
                stateCounts.put(state, stateCounts.getOrDefault(state, 0) + 1);
            }
        }

        return stateCounts;
    }

    /**
     * Extracts the state from addresses stored in one of two formats:
     *
     * <ul>
     * <li>4-part (with country): {@code "Address, City, State, Country - Pincode"}
     * → comma-index 2 is State.</li>
     * <li>3-part (legacy, no country): {@code "Address, City, State - Pincode"}
     * → comma-index 2 is "State - Pincode"; we strip everything after " - ".</li>
     * </ul>
     *
     * In the 4-part format the last comma segment is {@code "Country - Pincode"},
     * so reading {@code commaParts[length - 1]} was returning the country.
     * The state is always at index 2 (0-based), regardless of whether Country is
     * present.
     */
    private String extractStateFromAddress(String address) {
        if (address == null)
            return null;

        // Split on ", " (comma + space) to avoid spurious splits inside the pincode.
        String[] commaParts = address.split(",\\s*");

        // Need at least: Address(0), City(1), State(2)
        if (commaParts.length < 3)
            return null;

        // Index 2 is always State, in both the 3-part and 4-part formats.
        String statePart = commaParts[2].trim();

        // For the legacy 3-part format the state segment looks like "Karnataka -
        // 560001".
        // Strip the " - Pincode" suffix if present.
        int dashIdx = statePart.indexOf(" - ");
        if (dashIdx != -1) {
            statePart = statePart.substring(0, dashIdx).trim();
        }

        return statePart.isBlank() ? null : statePart;
    }
}
