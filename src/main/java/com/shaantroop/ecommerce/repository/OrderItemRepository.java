package com.shaantroop.ecommerce.repository;

import com.shaantroop.ecommerce.model.OrderItem;
import com.shaantroop.ecommerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByProduct(Product product);
}
