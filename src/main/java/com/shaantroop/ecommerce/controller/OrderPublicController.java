package com.shaantroop.ecommerce.controller;

import com.shaantroop.ecommerce.dto.OrderDTO;
import com.shaantroop.ecommerce.dto.OrderRequestDTO;
import com.shaantroop.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderPublicController {

    private final OrderService orderService;

    public OrderPublicController(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * Creates an order.
     * <p>
     * If the caller is authenticated (via HttpOnly cookie OR Bearer header),
     * Spring Security populates {@code Principal} automatically through
     * {@link com.shaantroop.ecommerce.security.JwtAuthenticationFilter}.
     * For guest checkouts the endpoint is permitAll(), so {@code principal}
     * will be {@code null}.
     */
    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(
            @Valid @RequestBody OrderRequestDTO request,
            Principal principal) {

        String username = (principal != null) ? principal.getName() : null;

        OrderDTO createdOrder = orderService.createOrder(request, username);
        return new ResponseEntity<>(createdOrder, HttpStatus.CREATED);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderDTO>> getMyOrders(Principal principal) {
        if (principal == null || principal.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<OrderDTO> orders = orderService.getMyOrders(principal.getName());
        return ResponseEntity.ok(orders);
    }
}
