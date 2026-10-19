package com.taskflow.service;

import com.taskflow.entity.Task;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:no-reply@taskflow.local}")
    private String fromAddress;

    @Async
    public void sendTaskCreatedNotification(Task task) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo("owner@taskflow.local");
            message.setSubject("Nouvelle tâche créée : " + task.getTitle());
            message.setText(String.format(
                    "Une nouvelle tâche a été créée.%n%n" +
                            "ID       : %d%n" +
                            "Titre    : %s%n" +
                            "Priorité : %s%n" +
                            "Statut   : %s%n" +
                            "Desc.    : %s%n",
                    task.getId(),
                    task.getTitle(),
                    task.getPriority(),
                    task.getStatus(),
                    task.getDescription() != null ? task.getDescription() : "(aucune)"
            ));
            mailSender.send(message);
            log.info("Email envoyé pour la tâche #{}", task.getId());
        } catch (Exception e) {
            log.warn("Échec de l'envoi de l'email : {}", e.getMessage());
        }
    }
}