package com.shaantroop.ecommerce.dto;

import com.shaantroop.ecommerce.model.UserProfile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponseDTO {

    private String fullName;
    private String altContactEmail;
    private String phone;
    private String addressLine;
    private String city;
    private String state;
    private LocalDate dateOfBirth;
    private String country;

    public static UserProfileResponseDTO fromEntity(UserProfile profile) {
        if (profile == null) {
            return new UserProfileResponseDTO();
        }
        return UserProfileResponseDTO.builder()
                .fullName(profile.getFullName())
                .altContactEmail(profile.getAltContactEmail())
                .phone(profile.getPhone())
                .addressLine(profile.getAddressLine())
                .city(profile.getCity())
                .state(profile.getState())
                .dateOfBirth(profile.getDateOfBirth())
                .country(profile.getCountry())
                .build();
    }
}
