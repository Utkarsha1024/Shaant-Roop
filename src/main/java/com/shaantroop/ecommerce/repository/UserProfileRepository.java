package com.shaantroop.ecommerce.repository;

import com.shaantroop.ecommerce.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByUserId(Long userId);

    @Query("SELECT p.dateOfBirth FROM UserProfile p WHERE p.dateOfBirth IS NOT NULL")
    List<LocalDate> findAllDateOfBirths();
}
