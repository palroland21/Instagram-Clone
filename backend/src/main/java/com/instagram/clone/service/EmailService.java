package com.instagram.clone.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;

    public void sendBanEmail(String toEmail, String username) {
        SimpleMailMessage message = new SimpleMailMessage();

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
}