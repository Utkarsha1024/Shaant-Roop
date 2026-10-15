package com.shaantroop.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileRequestDTO {

    @NotBlank(message = "Full name is required")
    private String fullName;

    private String altContactEmail;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Address line is required")
    private String addressLine;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    private LocalDate dateOfBirth;

    @NotBlank(message = "Country is required")
    private String country;
}
