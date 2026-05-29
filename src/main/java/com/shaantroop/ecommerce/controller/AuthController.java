package com.shaantroop.ecommerce.controller;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.shaantroop.ecommerce.dto.AuthResponse;
import com.shaantroop.ecommerce.dto.GoogleLoginRequest;
import com.shaantroop.ecommerce.dto.LoginRequest;
import com.shaantroop.ecommerce.dto.RegisterRequest;
import com.shaantroop.ecommerce.dto.UserDTO;
import com.shaantroop.ecommerce.enums.UserRole;
import com.shaantroop.ecommerce.model.User;
import com.shaantroop.ecommerce.repository.UserRepository;
import com.shaantroop.ecommerce.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Value("${app.google.client-id}")
    private String googleClientId;

    @Autowired
    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email is already registered");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(UserRole.CUSTOMER) // Hardcoded based on requirements
                .build();

        user = userRepository.save(user);

        String token = jwtService.generateToken(user.getUsername(), user.getRole().name());
        AuthResponse authResponse = new AuthResponse(token, UserDTO.fromEntity(user));

        ResponseCookie jwtCookie = ResponseCookie.from("shaantroop_token", token)
                .httpOnly(true)
                .secure(true) // Enforces HTTPS (note: may require localhost exception in dev)
                .path("/")
                .maxAge(24 * 60 * 60)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .body(authResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsernameOrEmail());
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(request.getUsernameOrEmail());
        }

        if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPasswordHash())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        User user = userOpt.get();
        String token = jwtService.generateToken(user.getUsername(), user.getRole().name());
        AuthResponse authResponse = new AuthResponse(token, UserDTO.fromEntity(user));

        ResponseCookie jwtCookie = ResponseCookie.from("shaantroop_token", token)
                .httpOnly(true)
                .secure(true) // Enforces HTTPS (note: may require localhost exception in dev)
                .path("/")
                .maxAge(24 * 60 * 60)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .body(authResponse);
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.getIdToken());
            if (idToken == null) {
                return ResponseEntity.status(401).body("Invalid Google ID token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            
            // Check if user exists
            Optional<User> userOpt = userRepository.findByEmail(email);
            User user;
            if (userOpt.isPresent()) {
                user = userOpt.get();
            } else {
                // Register new user
                user = User.builder()
                        .username(email)
                        .email(email)
                        .passwordHash(passwordEncoder.encode(UUID.randomUUID().toString()))
                        .role(UserRole.CUSTOMER)
                        .build();
                user = userRepository.save(user);
            }

            String token = jwtService.generateToken(user.getUsername(), user.getRole().name());
            AuthResponse authResponse = new AuthResponse(token, UserDTO.fromEntity(user));

            ResponseCookie jwtCookie = ResponseCookie.from("shaantroop_token", token)
                    .httpOnly(true)
                    .secure(true)
                    .path("/")
                    .maxAge(24 * 60 * 60)
                    .build();

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                    .body(authResponse);

        } catch (Exception e) {
            return ResponseEntity.status(401).body("Error verifying Google ID token: " + e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Expire the HttpOnly cookie immediately by setting maxAge to 0
        ResponseCookie expiredCookie = ResponseCookie.from("shaantroop_token", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, expiredCookie.toString())
                .body("Logged out successfully");
    }
}
