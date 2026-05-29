package com.shaantroop.ecommerce.dto;

import com.shaantroop.ecommerce.enums.OrderStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderDTO {
    private Long id;
    private String contactName;
    private String contactEmail;
    private String contactPhone;
    private String shippingAddress;
    private BigDecimal subTotal;
    private BigDecimal shippingCost;
    private BigDecimal totalAmount;
    private List<OrderItemDTO> items;
    private OrderStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
