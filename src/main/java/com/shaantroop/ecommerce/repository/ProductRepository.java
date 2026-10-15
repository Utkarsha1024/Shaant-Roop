package com.shaantroop.ecommerce.repository;

import com.shaantroop.ecommerce.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByNameContainingIgnoreCase(String name);

    @org.springframework.data.jpa.repository.Query("SELECT p.imageUrl FROM Product p WHERE p.imageUrl IS NOT NULL")
    List<String> findAllImageUrls();
}
