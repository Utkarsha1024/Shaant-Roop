package com.shaantroop.ecommerce.dto;

import com.shaantroop.ecommerce.model.UserProfile;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileDTO {

    private String fullName;
    private String altContactEmail;
    private String primaryShippingAddress;

    public static UserProfileDTO fromEntity(UserProfile profile) {
        if (profile == null) {
            return new UserProfileDTO();
        }
        return UserProfileDTO.builder()
                .fullName(profile.getFullName())
                .altContactEmail(profile.getAltContactEmail())
                .primaryShippingAddress(profile.getPrimaryShippingAddress())
                .build();
    }
}
