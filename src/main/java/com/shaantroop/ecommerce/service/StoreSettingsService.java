package com.shaantroop.ecommerce.service;

import com.shaantroop.ecommerce.dto.StoreSettingsDTO;
import com.shaantroop.ecommerce.model.StoreSettings;
import com.shaantroop.ecommerce.repository.StoreSettingsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StoreSettingsService {

    private final StoreSettingsRepository repository;

    public StoreSettingsService(StoreSettingsRepository repository) {
        this.repository = repository;
    }

    public StoreSettingsDTO getSettings() {
        StoreSettings settings = getSingletonSettings();
        return StoreSettingsDTO.builder()
                .paymentPhoneNumber(settings.getPaymentPhoneNumber())
                .paymentUpiId(settings.getPaymentUpiId())
                .build();
    }

    public StoreSettingsDTO updateSettings(StoreSettingsDTO dto) {
        StoreSettings settings = getSingletonSettings();
        settings.setPaymentPhoneNumber(dto.getPaymentPhoneNumber());
        settings.setPaymentUpiId(dto.getPaymentUpiId());
        settings = repository.save(settings);
        
        return StoreSettingsDTO.builder()
                .paymentPhoneNumber(settings.getPaymentPhoneNumber())
                .paymentUpiId(settings.getPaymentUpiId())
                .build();
    }

    private StoreSettings getSingletonSettings() {
        List<StoreSettings> all = repository.findAll();
        if (all.isEmpty()) {
            // Failsafe if CommandLineRunner hasn't run or DB was cleared
            StoreSettings newSettings = new StoreSettings();
            return repository.save(newSettings);
        }
        return all.get(0);
    }
}
