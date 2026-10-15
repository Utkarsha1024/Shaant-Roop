package com.shaantroop.ecommerce.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false, unique = true)
    private User user;

    @NotBlank(message = "Full name is required")
    @Column(name = "full_name", length = 100)
    private String fullName;

    @Column(name = "alt_contact_email", length = 100)
    private String altContactEmail;

    @NotBlank(message = "Phone number is required")
    @Column(name = "phone", length = 20)
    private String phone;

    @NotBlank(message = "Address line is required")
    @Column(name = "address_line", length = 255)
    private String addressLine;

    @NotBlank(message = "City is required")
    @Column(name = "city", length = 100)
    private String city;

    @NotBlank(message = "State is required")
    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Country is required")
    @Column(name = "country", length = 100)
    private String country;
}
