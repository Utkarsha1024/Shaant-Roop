package com.shaantroop.ecommerce.controller;

import com.shaantroop.ecommerce.dto.OrderDTO;
import com.shaantroop.ecommerce.dto.OrderRequestDTO;
import com.shaantroop.ecommerce.service.OrderService;
import com.shaantroop.ecommerce.security.JwtService;
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
    private final JwtService jwtService;

    public OrderPublicController(OrderService orderService, JwtService jwtService) {
        this.orderService = orderService;
        this.jwtService = jwtService;
    }

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(
            @Valid @RequestBody OrderRequestDTO request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        
        String username = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            username = jwtService.extractUsername(token);
        }

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
