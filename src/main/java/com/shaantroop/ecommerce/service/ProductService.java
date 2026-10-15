package com.shaantroop.ecommerce.service;

import com.shaantroop.ecommerce.dto.ProductDTO;
import com.shaantroop.ecommerce.exception.ResourceNotFoundException;
import com.shaantroop.ecommerce.model.Category;
import com.shaantroop.ecommerce.model.Product;
import com.shaantroop.ecommerce.repository.CategoryRepository;
import com.shaantroop.ecommerce.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final com.shaantroop.ecommerce.repository.OrderItemRepository orderItemRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository, com.shaantroop.ecommerce.repository.OrderItemRepository orderItemRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.orderItemRepository = orderItemRepository;
    }

    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll().stream()
                .map(ProductDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return ProductDTO.fromEntity(product);
    }

    public ProductDTO createProduct(ProductDTO productDTO) {
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", productDTO.getCategoryId()));

        Product product = Product.builder()
                .name(productDTO.getName())
                .description(productDTO.getDescription())
                .price(productDTO.getPrice())
                .stockQuantity(productDTO.getStockQuantity())
                .imageUrl(productDTO.getImageUrl())
                .category(category)
                .build();

        Product savedProduct = productRepository.save(product);
        return ProductDTO.fromEntity(savedProduct);
    }

    public ProductDTO updateProduct(Long id, ProductDTO productDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", productDTO.getCategoryId()));

        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setStockQuantity(productDTO.getStockQuantity());
        product.setImageUrl(productDTO.getImageUrl());
        product.setCategory(category);
        product.setDiscontinued(productDTO.isDiscontinued());

        Product updatedProduct = productRepository.save(product);
        return ProductDTO.fromEntity(updatedProduct);
    }

    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
                
        // Severe foreign key constraint on historical orders
        List<com.shaantroop.ecommerce.model.OrderItem> relatedItems = orderItemRepository.findByProduct(product);
        for (com.shaantroop.ecommerce.model.OrderItem item : relatedItems) {
            item.setProduct(null);
            // item.setProductName is already set during order creation for new orders, 
            // but for safety, if it's null (legacy), we populate it here before unlinking.
            if (item.getProductName() == null) {
                item.setProductName(product.getName());
            }
        }
        orderItemRepository.saveAll(relatedItems);

        productRepository.delete(product);
    }
}
