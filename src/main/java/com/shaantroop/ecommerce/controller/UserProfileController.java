package com.shaantroop.ecommerce.controller;

import com.shaantroop.ecommerce.dto.UserProfileRequestDTO;
import com.shaantroop.ecommerce.dto.UserProfileResponseDTO;
import com.shaantroop.ecommerce.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class UserProfileController {

    private final UserProfileService userProfileService;

    public UserProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping
    public ResponseEntity<UserProfileResponseDTO> getProfile(Authentication authentication) {
        // Authentication principle contains the username when using JwtAuthenticationFilter
        String username = authentication.getName();
        UserProfileResponseDTO profile = userProfileService.getProfile(username);
        return ResponseEntity.ok(profile);
    }

    @PutMapping
    public ResponseEntity<UserProfileResponseDTO> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UserProfileRequestDTO profileDTO
    ) {
        String username = authentication.getName();
        UserProfileResponseDTO updatedProfile = userProfileService.updateProfile(username, profileDTO);
        return ResponseEntity.ok(updatedProfile);
    }
}
