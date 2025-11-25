package com.p2abot.controller;

import com.p2abot.model.BotNote;
import com.p2abot.model.UserWarning;
import com.p2abot.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/bot")
@RequiredArgsConstructor
public class BotApiController {
    private final BotNoteService noteService;
    private final BotFilterService filterService;
    private final UserWarningService warningService;
    private final BotStatsService statsService;

    // Notes API
    @PostMapping("/{chatId}/notes")
    public ResponseEntity<BotNote> saveNote(
            @PathVariable Long chatId,
            @RequestParam String key,
            @RequestParam String content) {
        log.info("📝 [BotApiController] Saving note");
        BotNote note = noteService.saveNote(chatId, key, content);
        return ResponseEntity.ok(note);
    }

    @GetMapping("/{chatId}/notes/{key}")
    public ResponseEntity<Map<String, Object>> getNote(
            @PathVariable Long chatId,
            @PathVariable String key) {
        log.info("🔍 [BotApiController] Getting note: {}", key);
        var note = noteService.getNote(chatId, key);
        
        Map<String, Object> response = new HashMap<>();
        if (note.isPresent()) {
            response.put("found", true);
            response.put("note", note.get());
        } else {
            response.put("found", false);
            response.put("message", "Note not found");
        }
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{chatId}/notes")
    public ResponseEntity<Map<String, Object>> listNotes(@PathVariable Long chatId) {
        log.info("📋 [BotApiController] Listing notes for chat: {}", chatId);
        List<BotNote> notes = noteService.getAllNotes(chatId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("chatId", chatId);
        response.put("total", notes.size());
        response.put("notes", notes);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{chatId}/notes/{key}")
    public ResponseEntity<Map<String, Object>> deleteNote(
            @PathVariable Long chatId,
            @PathVariable String key) {
        log.warn("🗑️ [BotApiController] Deleting note: {}", key);
        noteService.deleteNote(chatId, key);
        
        Map<String, Object> response = new HashMap<>();
        response.put("deleted", true);
        response.put("key", key);
        return ResponseEntity.ok(response);
    }

    // Warnings API
    @PostMapping("/{chatId}/warnings/{userId}")
    public ResponseEntity<UserWarning> addWarning(
            @PathVariable Long chatId,
            @PathVariable Long userId,
            @RequestParam(required = false) String reason) {
        log.warn("⚠️ [BotApiController] Adding warning for user: {}", userId);
        UserWarning warning = warningService.addWarning(chatId, userId, reason != null ? reason : "No reason");
        statsService.incrementWarnings(chatId);
        return ResponseEntity.ok(warning);
    }

    @GetMapping("/{chatId}/warnings/{userId}")
    public ResponseEntity<Map<String, Object>> getWarnings(
            @PathVariable Long chatId,
            @PathVariable Long userId) {
        log.info("📊 [BotApiController] Getting warnings for user: {}", userId);
        Integer count = warningService.getWarningCount(chatId, userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("userId", userId);
        response.put("chatId", chatId);
        response.put("warningCount", count);
        response.put("autobanAt", 3);
        response.put("status", count >= 3 ? "banned" : "active");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{chatId}/warnings/{userId}")
    public ResponseEntity<Map<String, Object>> clearWarnings(
            @PathVariable Long chatId,
            @PathVariable Long userId) {
        log.info("✅ [BotApiController] Clearing warnings for user: {}", userId);
        warningService.clearWarnings(chatId, userId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("cleared", true);
        response.put("userId", userId);
        return ResponseEntity.ok(response);
    }

    // Filters API
    @PostMapping("/{chatId}/filters")
    public ResponseEntity<Map<String, Object>> addFilter(
            @PathVariable Long chatId,
            @RequestParam String pattern,
            @RequestParam String replacement,
            @RequestParam(defaultValue = "false") Boolean regex) {
        log.info("🔧 [BotApiController] Adding filter");
        filterService.addFilter(chatId, pattern, replacement, regex);
        
        Map<String, Object> response = new HashMap<>();
        response.put("added", true);
        response.put("pattern", pattern);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{chatId}/filters")
    public ResponseEntity<Map<String, Object>> listFilters(@PathVariable Long chatId) {
        log.info("📋 [BotApiController] Listing filters for chat: {}", chatId);
        var filters = filterService.getFilters(chatId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("chatId", chatId);
        response.put("total", filters.size());
        response.put("filters", filters);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{chatId}/filters/{filterId}")
    public ResponseEntity<Map<String, Object>> deleteFilter(
            @PathVariable Long chatId,
            @PathVariable String filterId) {
        log.warn("🗑️ [BotApiController] Deleting filter: {}", filterId);
        filterService.deleteFilter(chatId, filterId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("deleted", true);
        response.put("filterId", filterId);
        return ResponseEntity.ok(response);
    }

    // Stats API
    @GetMapping("/{chatId}/stats")
    public ResponseEntity<Map<String, Object>> getDetailedStats(@PathVariable Long chatId) {
        log.info("📊 [BotApiController] Getting detailed stats for chat: {}", chatId);
        var stats = statsService.getStats(chatId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("chatId", chatId);
        response.put("stats", stats);
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{chatId}/stats/increment/{action}")
    public ResponseEntity<Map<String, Object>> incrementStat(
            @PathVariable Long chatId,
            @PathVariable String action) {
        log.info("📈 [BotApiController] Incrementing {} stat for chat: {}", action, chatId);
        
        switch (action.toLowerCase()) {
            case "message" -> statsService.incrementMessages(chatId);
            case "warning" -> statsService.incrementWarnings(chatId);
            case "ban" -> statsService.incrementBans(chatId);
            case "kick" -> statsService.incrementKicks(chatId);
        }
        
        var stats = statsService.getStats(chatId);
        
        Map<String, Object> response = new HashMap<>();
        response.put("action", action);
        response.put("stats", stats);
        return ResponseEntity.ok(response);
    }
}
