package com.p2abot.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "telegram_chats")
public class TelegramChat {
    @Id
    private Long chatId;

    private String title;
    private String type; // group, supergroup, private, channel
    private String description;
    private Integer memberCount;

    private Boolean antiFloodEnabled;
    private Boolean autoWelcomeEnabled;
    private String welcomeMessage;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
