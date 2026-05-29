package com.shaantroop.ecommerce.controller;

import com.shaantroop.ecommerce.dto.OrderDTO;
import com.shaantroop.ecommerce.dto.UpdateOrderStatusDTO;
import com.shaantroop.ecommerce.exception.ResourceNotFoundException;
import com.shaantroop.ecommerce.model.Order;
import com.shaantroop.ecommerce.repository.OrderRepository;
import com.shaantroop.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final OrderService orderService;

    public OrderController(OrderRepository orderRepository, OrderService orderService) {
        this.orderRepository = orderRepository;
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        // Fetch all orders sorted by createdAt in descending order (newest first)
        List<Order> orders = orderRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        
        List<OrderDTO> orderDTOs = orders.stream()
                .map(orderService::mapToDTO)
                .collect(Collectors.toList());
                
        return ResponseEntity.ok(orderDTOs);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long id, 
            @Valid @RequestBody UpdateOrderStatusDTO request) {
            
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));
                
        order.setStatus(request.getStatus());
        Order updatedOrder = orderRepository.save(order);
        
        return ResponseEntity.ok(orderService.mapToDTO(updatedOrder));
    }
}
