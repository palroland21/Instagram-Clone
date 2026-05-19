package com.instagram.clone.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

@Service
public class SmsService {

    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\+[1-9]\\d{7,14}$");

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${textbee.api-key}")
    private String apiKey;

    @Value("${textbee.device-id}")
    private String deviceId;

    public void sendBanSms(String toPhoneNumber, String username) {
        if (isMissing(apiKey) || isMissing(deviceId)) {
            throw new RuntimeException("TextBee config is missing. Set TEXTBEE_API_KEY and TEXTBEE_DEVICE_ID.");
        }

        String normalizedPhoneNumber = normalizePhoneNumber(toPhoneNumber);
        String message = "Hello " + username + ", your Instagram Clone account has been banned by a moderator.";

        try {
            String requestBody = objectMapper.writeValueAsString(Map.of(
                    "recipients", List.of(normalizedPhoneNumber),
                    "message", message
            ));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.textbee.dev/api/v1/gateway/devices/" + deviceId + "/send-sms"))
                    .header("Content-Type", "application/json")
                    .header("x-api-key", apiKey)
                    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw new RuntimeException("TextBee failed to send SMS: " + response.body());
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not call TextBee API.", e);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("TextBee SMS request was interrupted.", e);
        }
    }

    private String normalizePhoneNumber(String phoneNumber) {
        if (phoneNumber == null || phoneNumber.isBlank() || "UNKNOWN".equalsIgnoreCase(phoneNumber.trim())) {
            throw new RuntimeException("User does not have a valid phone number.");
        }

        String normalized = phoneNumber
                .trim()
                .replace(" ", "")
                .replace("-", "")
                .replace("(", "")
                .replace(")", "");

        if (normalized.startsWith("00")) {
            normalized = "+" + normalized.substring(2);
        } else if (normalized.startsWith("0")) {
            normalized = "+40" + normalized.substring(1);
        } else if (normalized.startsWith("40")) {
            normalized = "+" + normalized;
        }

        if (!PHONE_PATTERN.matcher(normalized).matches()) {
            throw new RuntimeException("Phone number is invalid. Use format +40712345678.");
        }

        return normalized;
    }

    private boolean isMissing(String value) {
        return value == null || value.isBlank() || value.startsWith("${");
    }
}