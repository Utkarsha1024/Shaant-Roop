package com.shaantroop.ecommerce.dto;

import com.shaantroop.ecommerce.model.Product;
import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private String imageUrl;
    private Long categoryId;
    private String categoryName;
    private boolean discontinued;

    public static ProductDTO fromEntity(Product product) {
        if (product == null) {
            return null;
        }
        ProductDTOBuilder builder = ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .imageUrl(product.getImageUrl())
                .discontinued(product.isDiscontinued());

        if (product.getCategory() != null) {
            builder.categoryId(product.getCategory().getId())
                   .categoryName(product.getCategory().getName());
        }

        return builder.build();
    }
}
