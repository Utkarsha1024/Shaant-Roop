package com.shaantroop.ecommerce.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface SalesDataPoint {
    LocalDate getOrderDate();
    BigDecimal getTotalRevenue();
}
