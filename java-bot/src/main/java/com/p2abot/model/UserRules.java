package com.p2abot.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_rules")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRules {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private Long chatId;
    private Long userId;
    
    private Integer warningCount = 0;
    private Boolean muted = false;
    private Boolean banned = false;
    private Long mutedUntil;
    
    private String violations;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
