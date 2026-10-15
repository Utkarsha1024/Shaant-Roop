package com.shaantroop.ecommerce.service;

import com.shaantroop.ecommerce.dto.UserProfileRequestDTO;
import com.shaantroop.ecommerce.dto.UserProfileResponseDTO;
import com.shaantroop.ecommerce.model.User;
import com.shaantroop.ecommerce.model.UserProfile;
import com.shaantroop.ecommerce.repository.UserProfileRepository;
import com.shaantroop.ecommerce.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    public UserProfileService(UserProfileRepository userProfileRepository, UserRepository userRepository) {
        this.userProfileRepository = userProfileRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public UserProfileResponseDTO getProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return userProfileRepository.findByUserId(user.getId())
                .map(UserProfileResponseDTO::fromEntity)
                .orElse(new UserProfileResponseDTO());
    }

    @Transactional
    public UserProfileResponseDTO updateProfile(String username, UserProfileRequestDTO dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<UserProfile> existingProfileOpt = userProfileRepository.findByUserId(user.getId());

        UserProfile profile;
        if (existingProfileOpt.isPresent()) {
            profile = existingProfileOpt.get();
        } else {
            profile = new UserProfile();
            profile.setUser(user);
        }

        profile.setFullName(dto.getFullName());
        profile.setAltContactEmail(dto.getAltContactEmail());
        profile.setPhone(dto.getPhone());
        profile.setAddressLine(dto.getAddressLine());
        profile.setCity(dto.getCity());
        profile.setState(dto.getState());
        profile.setDateOfBirth(dto.getDateOfBirth());
        profile.setCountry(dto.getCountry());

        UserProfile savedProfile = userProfileRepository.save(profile);
        return UserProfileResponseDTO.fromEntity(savedProfile);
    }
}
