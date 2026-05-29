package com.shaantroop.ecommerce.service;

import com.shaantroop.ecommerce.dto.OrderDTO;
import com.shaantroop.ecommerce.dto.OrderItemDTO;
import com.shaantroop.ecommerce.dto.OrderItemRequestDTO;
import com.shaantroop.ecommerce.dto.OrderRequestDTO;
import com.shaantroop.ecommerce.enums.OrderStatus;
import com.shaantroop.ecommerce.exception.ResourceNotFoundException;
import com.shaantroop.ecommerce.model.Order;
import com.shaantroop.ecommerce.model.OrderItem;
import com.shaantroop.ecommerce.model.User;
import com.shaantroop.ecommerce.repository.OrderRepository;
import com.shaantroop.ecommerce.repository.ProductRepository;
import com.shaantroop.ecommerce.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.shaantroop.ecommerce.model.Product;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository,
            UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public OrderDTO createOrder(OrderRequestDTO request, String username) {
        BigDecimal subTotal = BigDecimal.ZERO;
        int totalQuantity = 0;

        Order order = Order.builder()
                .contactName(request.getContactName())
                .contactEmail(request.getContactEmail())
                .contactPhone(request.getContactPhone())
                .shippingAddress(request.getShippingAddress())
                .status(OrderStatus.PENDING)
                .build();

        if (username != null) {
            userRepository.findByUsername(username).ifPresent(order::setUser);
        }

        List<OrderItem> items = new ArrayList<>();

        for (OrderItemRequestDTO itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", itemRequest.getProductId()));

            int qty = itemRequest.getQuantity();
            BigDecimal unitPrice = product.getPrice();
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(qty));

            subTotal = subTotal.add(lineTotal);
            totalQuantity += qty;

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(qty)
                    .unitPrice(unitPrice)
                    .build();
            items.add(orderItem);
        }

        order.setItems(items);
        order.setSubTotal(subTotal);

        BigDecimal shippingCost = calculateShippingCost(totalQuantity);
        order.setShippingCost(shippingCost);
        order.setTotalAmount(subTotal.add(shippingCost));

        Order savedOrder = orderRepository.save(order);
        return mapToDTO(savedOrder);
    }

    public List<OrderDTO> getMyOrders(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return orders.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private BigDecimal calculateShippingCost(int totalQuantity) {
        if (totalQuantity >= 4) {
            return BigDecimal.ZERO;
        } else if (totalQuantity == 3) {
            return new BigDecimal("20.00");
        } else if (totalQuantity == 2) {
            return new BigDecimal("30.00");
        } else {
            // 1 item or default fallback
            return new BigDecimal("45.00");
        }
    }

    public OrderDTO mapToDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getItems().stream().map(item -> OrderItemDTO.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .productImageUrl(item.getProduct().getImageUrl())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .build()).collect(Collectors.toList());

        return OrderDTO.builder()
                .id(order.getId())
                .contactName(order.getContactName())
                .contactEmail(order.getContactEmail())
                .contactPhone(order.getContactPhone())
                .shippingAddress(order.getShippingAddress())
                .subTotal(order.getSubTotal())
                .shippingCost(order.getShippingCost())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .items(itemDTOs)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
