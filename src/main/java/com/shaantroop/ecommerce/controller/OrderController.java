package com.shaantroop.ecommerce.controller;

import com.shaantroop.ecommerce.dto.OrderDTO;
import com.shaantroop.ecommerce.dto.UpdateOrderStatusDTO;
import com.shaantroop.ecommerce.enums.OrderStatus;
import com.shaantroop.ecommerce.exception.ResourceNotFoundException;
import com.shaantroop.ecommerce.model.Order;
import com.shaantroop.ecommerce.model.OrderItem;
import com.shaantroop.ecommerce.model.Product;
import com.shaantroop.ecommerce.repository.OrderRepository;
import com.shaantroop.ecommerce.repository.ProductRepository;
import com.shaantroop.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderService orderService;

    public OrderController(OrderRepository orderRepository,
                           ProductRepository productRepository,
                           OrderService orderService) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<Order> orders = orderRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));

        List<OrderDTO> orderDTOs = orders.stream()
                .map(orderService::mapToDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(orderDTOs);
    }

    @PutMapping("/{id}/status")
    @Transactional
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusDTO request) {

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        OrderStatus previousStatus = order.getStatus();
        OrderStatus newStatus = request.getStatus();

        // ── Restock on cancellation ──────────────────────────────────────────
        // Only restore stock when transitioning INTO CANCELLED from a non-cancelled
        // state, to avoid double-restocking if the status is set to CANCELLED again.
        if (newStatus == OrderStatus.CANCELLED && previousStatus != OrderStatus.CANCELLED) {
            for (OrderItem item : order.getItems()) {
                Product product = item.getProduct();
                // Skip items whose product has been soft-deleted (product is null)
                // or that use the Made-to-Order sentinel value (-1).
                if (product == null || product.getStockQuantity() == -1) {
                    continue;
                }
                product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                productRepository.save(product);
            }
        }

        order.setStatus(newStatus);
        Order updatedOrder = orderRepository.save(order);

        return ResponseEntity.ok(orderService.mapToDTO(updatedOrder));
    }
}
