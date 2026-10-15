package com.shaantroop.ecommerce.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Course title is required")
    @Column(nullable = false, length = 150)
    private String title;

    @NotBlank(message = "Description is required")
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Price is required")
    @PositiveOrZero(message = "Price must be zero or greater")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @NotBlank(message = "Instructor name is required")
    @Column(nullable = false, length = 100)
    private String instructor;

    @NotBlank(message = "Duration is required")
    @Column(nullable = false, length = 50)
    private String duration; // e.g., "4 Weeks", "10 Hours"
}
