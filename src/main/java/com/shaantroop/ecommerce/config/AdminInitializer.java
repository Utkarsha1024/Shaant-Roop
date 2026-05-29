package com.shaantroop.ecommerce.config;

import com.shaantroop.ecommerce.enums.UserRole;
import com.shaantroop.ecommerce.model.User;
import com.shaantroop.ecommerce.repository.UserRepository;
import com.shaantroop.ecommerce.model.Category;
import com.shaantroop.ecommerce.model.StoreSettings;
import com.shaantroop.ecommerce.repository.CategoryRepository;
import com.shaantroop.ecommerce.repository.StoreSettingsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminInitializer.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final StoreSettingsRepository storeSettingsRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    public AdminInitializer(UserRepository userRepository, CategoryRepository categoryRepository, StoreSettingsRepository storeSettingsRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.storeSettingsRepository = storeSettingsRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail(adminEmail)) {
            User adminUser = User.builder()
                    .username("admin") // Default admin username
                    .email(adminEmail)
                    .passwordHash(passwordEncoder.encode(adminPassword))
                    .role(UserRole.ADMIN)
                    .build();

            userRepository.save(adminUser);
            logger.info("Created default admin user with email: {}", adminEmail);
        } else {
            logger.info("Admin user with email {} already exists.", adminEmail);
        }

        if (categoryRepository.count() == 0) {
            seedCategories();
        } else {
            logger.info("Categories already exist, skipping seeding.");
        }

        if (storeSettingsRepository.count() == 0) {
            StoreSettings settings = StoreSettings.builder()
                    .paymentPhoneNumber("+91 98765 43210")
                    .paymentUpiId("shaantroop@upi")
                    .build();
            storeSettingsRepository.save(settings);
            logger.info("Seeded initial store settings.");
        }
    }

    private void seedCategories() {
        Category faceCare = Category.builder()
                .name("Face Care")
                .slug("face-care")
                .description("Handcrafted natural skincare for your face.")
                .build();
        Category bodyCare = Category.builder()
                .name("Body Care")
                .slug("body-care")
                .description("Nourishing and gentle care for your body.")
                .build();
        Category giftSet = Category.builder()
                .name("Gift Set")
                .slug("gift-set")
                .description("Perfect natural gifts for your loved ones.")
                .build();
        Category courses = Category.builder()
                .name("Courses")
                .slug("courses")
                .description("Learn the art of artisanal soap making.")
                .build();

        categoryRepository.save(faceCare);
        categoryRepository.save(bodyCare);
        categoryRepository.save(giftSet);
        categoryRepository.save(courses);

        logger.info("Seeded initial categories successfully.");
    }
}
