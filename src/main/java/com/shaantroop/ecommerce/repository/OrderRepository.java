package com.shaantroop.ecommerce.repository;

import com.shaantroop.ecommerce.dto.SalesDataPoint;
import com.shaantroop.ecommerce.dto.TopSellingProductDTO;
import com.shaantroop.ecommerce.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query(value = "SELECT DATE(created_at) as date, SUM(total_amount) as revenue " +
                   "FROM orders " +
                   "WHERE status != 'CANCELLED' " +
                   "GROUP BY DATE(created_at) " +
                   "ORDER BY date ASC", nativeQuery = true)
    List<SalesDataPoint> getSalesOverTime();

    @Query(value = "SELECT p.name AS productName, SUM(oi.quantity) AS quantitySold " +
                   "FROM order_items oi " +
                   "JOIN products p ON oi.product_id = p.id " +
                   "JOIN orders o ON oi.order_id = o.id " +
                   "WHERE o.status != 'CANCELLED' " +
                   "GROUP BY p.id, p.name " +
                   "ORDER BY quantitySold DESC " +
                   "LIMIT 5", nativeQuery = true)
    List<TopSellingProductDTO> getTopSellingProducts();

    @Query("SELECT o.shippingAddress FROM Order o WHERE o.shippingAddress IS NOT NULL")
    List<String> findAllShippingAddresses();
}
