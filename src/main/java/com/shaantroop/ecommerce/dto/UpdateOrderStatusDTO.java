package com.shaantroop.ecommerce.dto;

import com.shaantroop.ecommerce.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateOrderStatusDTO {
    
    @NotNull(message = "Status cannot be null")
    private OrderStatus status;
}
