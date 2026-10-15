package com.shaantroop.ecommerce.dto;

import java.math.BigDecimal;

public interface CategoryMetricDTO {
    String getCategoryName();
    Long getProductCount();
    BigDecimal getTotalRevenue();
}
