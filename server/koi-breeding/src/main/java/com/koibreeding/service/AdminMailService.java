package com.koibreeding.service;

import com.koibreeding.domain.User;
import com.koibreeding.enums.UserStatus;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminMailService {
    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String mailFrom;

    public void sendStatusChangedMail(User user, UserStatus status, String reason) {
        if (status == UserStatus.BANNED) {
            sendMail(user, "Your account has been banned", "banned", reason);
            return;
        }

        if (status == UserStatus.ACTIVE) {
            sendMail(user, "Your account has been unbanned", "unbanned", reason);
        }
    }

    private void sendMail(User user, String subject, String action, String reason) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(user.getEmail());
            if (mailFrom != null && !mailFrom.isBlank()) {
                helper.setFrom(mailFrom);
            }
            helper.setSubject("Koi Breeding - " + subject);

            String safeReason = reason == null || reason.isBlank() ? "No reason provided" : reason;
            String html = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <style>
                            body { font-family: Arial, sans-serif; background-color: #f5f7fb; margin: 0; padding: 32px; }
                            .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; }
                            .badge { display: inline-block; padding: 6px 12px; border-radius: 999px; background: #e0f2fe; color: #0369a1; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
                            h1 { margin: 18px 0 10px; font-size: 26px; color: #0f172a; }
                            p { color: #334155; line-height: 1.7; font-size: 15px; }
                            .reason { margin-top: 18px; padding: 16px; border-left: 4px solid #f59e0b; background: #fff7ed; color: #9a3412; border-radius: 10px; }
                            .footer { margin-top: 24px; color: #64748b; font-size: 13px; }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <span class="badge">Admin notice</span>
                            <h1>Your account has been %s</h1>
                            <p>Hello <strong>%s</strong>,</p>
                            <p>Your Koi Breeding account has been %s by an administrator.</p>
                            <div class="reason">
                                <strong>Reason:</strong> %s
                            </div>
                            <p class="footer">If you believe this is a mistake, please contact support.</p>
                        </div>
                    </body>
                    </html>
                    """.formatted(action, user.getUsername(), action, safeReason);

            helper.setText(html, true);
            mailSender.send(message);
        } catch (Exception exception) {
            throw new RuntimeException("Failed to send admin status email", exception);
        }
    }
}