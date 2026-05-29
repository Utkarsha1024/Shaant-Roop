package com.shaantroop.ecommerce.controller;

import com.shaantroop.ecommerce.dto.UserProfileDTO;
import com.shaantroop.ecommerce.service.UserProfileService;
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
    public ResponseEntity<UserProfileDTO> getProfile(Authentication authentication) {
        // Authentication principle contains the username when using JwtAuthenticationFilter
        String username = authentication.getName();
        UserProfileDTO profile = userProfileService.getProfile(username);
        return ResponseEntity.ok(profile);
    }

    @PutMapping
    public ResponseEntity<UserProfileDTO> updateProfile(
            Authentication authentication,
            @RequestBody UserProfileDTO profileDTO
    ) {
        String username = authentication.getName();
        UserProfileDTO updatedProfile = userProfileService.updateProfile(username, profileDTO);
        return ResponseEntity.ok(updatedProfile);
    }
}
