package com.p2abot.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "group_settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GroupSettings {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    @Column(unique = true, nullable = false)
    private Long chatId;
    
    private String groupName;
    private String groupDescription;
    
    private Boolean antiFloodEnabled = true;
    private Integer antiFloodThreshold = 5;
    
    private Boolean welcomeEnabled = true;
    private String welcomeMessage = "Welcome to our group!";
    
    private Boolean autoWarnEnabled = true;
    private Integer autoWarnThreshold = 3;
    
    private Boolean autoMuteEnabled = false;
    private Integer autoMuteDuration = 60;
    
    private Boolean autoBanEnabled = true;
    private Integer autoBanAfterWarnings = 3;
    
    private Boolean filterEnabled = true;
    
    private String rulesText;
    
    private Long adminUserId;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();
}
