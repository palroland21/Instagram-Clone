package com.instagram.clone.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class SmsService {

    private static final Pattern E164_PHONE_PATTERN = Pattern.compile("^\\+[1-9]\\d{7,14}$");

    @Value("${twilio.account-sid}")
    private String accountSid;

    @Value("${twilio.auth-token}")
    private String authToken;

    @Value("${twilio.from-number}")
    private String fromNumber;

    private boolean twilioInitialized = false;

    public void sendBanSms(String toPhoneNumber, String username) {
        validateTwilioConfig();

        String normalizedToNumber = normalizePhoneNumber(toPhoneNumber);
        String normalizedFromNumber = normalizePhoneNumber(fromNumber);

        initTwilioIfNeeded();

        Message.creator(
                new PhoneNumber(normalizedToNumber),
                new PhoneNumber(normalizedFromNumber),
                "Hello " + username + ", your Instagram Clone account has been banned by a moderator."
        ).create();
    }

    private synchronized void initTwilioIfNeeded() {
        if (!twilioInitialized) {
            Twilio.init(accountSid, authToken);
            twilioInitialized = true;
        }
    }

    private void validateTwilioConfig() {
        if (isMissingConfig(accountSid) || isMissingConfig(authToken) || isMissingConfig(fromNumber)) {
            throw new RuntimeException("Twilio config is missing. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_FROM_NUMBER.");
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
        } else if (normalized.startsWith("+")) {
            // already international
        } else if (normalized.startsWith("0")) {
            normalized = "+40" + normalized.substring(1);
        } else if (normalized.startsWith("40")) {
            normalized = "+" + normalized;
        } else if (normalized.matches("\\d{8,15}")) {
            normalized = "+" + normalized;
        }

        if (!E164_PHONE_PATTERN.matcher(normalized).matches()) {
            throw new RuntimeException("Phone number is invalid. Use international format, for example +40712345678.");
        }

        return normalized;
    }

    private boolean isMissingConfig(String value) {
        return value == null || value.isBlank() || value.startsWith("${");
    }
}