package com.p2abot.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        log.info("🏥 [HealthController] Health check requested");
        
        Map<String, Object> response = new HashMap<>();
        response.put("status", "🟢 RUNNING");
        response.put("bot", "P2A-Bot v2 - Java GOAT Edition");
        response.put("username", "p2abot");
        response.put("timestamp", LocalDateTime.now());
        response.put("database", "SQLite");
        response.put("version", "2.0.0");
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> info() {
        log.info("ℹ️ [HealthController] Info requested");
        
        Map<String, Object> response = new HashMap<>();
        response.put("name", "P2A-Bot");
        response.put("version", "2.0.0");
        response.put("edition", "Java GOAT");
        response.put("framework", "Spring Boot 3.2");
        response.put("database", "SQLite");
        response.put("features", new String[]{
            "Group Moderation",
            "Note Management",
            "Content Filtering",
            "Statistics Tracking",
            "User Warnings"
        });
        
        return ResponseEntity.ok(response);
    }
}
