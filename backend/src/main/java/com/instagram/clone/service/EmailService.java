package com.instagram.clone.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendBanEmail(String toEmail, String username) {
        if (isMissing(fromEmail)) {
            throw new RuntimeException("Gmail config is missing. Set MAIL_USERNAME.");
        }

        if (isMissing(toEmail)) {
            throw new RuntimeException("User does not have a valid email address.");
        }

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Your Instagram Clone account has been banned");
        message.setText(
                "Hello " + username + ",\n\n" +
                        "Your account has been banned by a moderator because of inappropriate behavior.\n\n" +
                        "You cannot access the application until a moderator unbans your account.\n\n" +
                        "Instagram Clone Team"
        );

        javaMailSender.send(message);
    }

    private boolean isMissing(String value) {
        return value == null || value.isBlank() || value.startsWith("${");
    }
}
