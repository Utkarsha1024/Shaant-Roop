package com.shaantroop.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseRequestDTO {

    @NotBlank(message = "Course title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Price is required")
    @PositiveOrZero(message = "Price must be zero or greater")
    private BigDecimal price;

    @NotBlank(message = "Instructor name is required")
    private String instructor;

    @NotBlank(message = "Duration is required")
    private String duration;
}
