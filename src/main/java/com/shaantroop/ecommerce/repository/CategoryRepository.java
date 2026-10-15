package com.shaantroop.ecommerce.repository;

import com.shaantroop.ecommerce.model.Category;
import com.shaantroop.ecommerce.dto.CategoryMetricDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findByName(String name);
    boolean existsByName(String name);

    @Query(value = "SELECT c.name AS categoryName, " +
                   "COUNT(DISTINCT p.id) AS productCount, " +
                   "COALESCE(SUM(oi.unit_price * oi.quantity), 0) AS totalRevenue " +
                   "FROM categories c " +
                   "LEFT JOIN products p ON c.id = p.category_id " +
                   "LEFT JOIN order_items oi ON p.id = oi.product_id " +
                   "LEFT JOIN orders o ON oi.order_id = o.id AND o.status != 'CANCELLED' " +
                   "GROUP BY c.id, c.name", nativeQuery = true)
    List<CategoryMetricDTO> getCategoryMetrics();
}
