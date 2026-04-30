package com.instagram.clone.service;

import com.instagram.clone.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InternalNotificationService {

    private final EmailService emailService;

    public void sendBanNotifications(User user) {
        sendBanEmail(user);
        sendBanSms(user);
    }

    private void sendBanEmail(User user) {
        try {
            emailService.sendBanEmail(user.getEmail(), user.getUsername());
            System.out.println("Ban email sent to " + user.getEmail());
        } catch (Exception e) {
            System.out.println("Failed to send ban email to " + user.getEmail());
            System.out.println(e.getMessage());
        }
    }

    private void sendBanSms(User user) {
        System.out.println("SMS SENT TO USER " + user.getUsername() + ": Your account has been banned.");
    }
}