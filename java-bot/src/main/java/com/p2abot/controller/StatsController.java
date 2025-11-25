package com.p2abot.controller;

import com.p2abot.model.BotStats;
import com.p2abot.service.BotStatsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/stats")
@RequiredArgsConstructor
public class StatsController {
    private final BotStatsService statsService;

    @GetMapping("/{chatId}")
    public ResponseEntity<BotStats> getStats(@PathVariable Long chatId) {
        log.info("📊 [StatsController] Fetching stats for chat: {}", chatId);
        BotStats stats = statsService.getStats(chatId);
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/{chatId}/message")
    public ResponseEntity<Void> recordMessage(@PathVariable Long chatId) {
        log.debug("💬 [StatsController] Recording message for chat: {}", chatId);
        statsService.incrementMessages(chatId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{chatId}/ban")
    public ResponseEntity<Void> recordBan(@PathVariable Long chatId) {
        log.info("🚫 [StatsController] Recording ban for chat: {}", chatId);
        statsService.incrementBans(chatId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{chatId}/kick")
    public ResponseEntity<Void> recordKick(@PathVariable Long chatId) {
        log.info("👢 [StatsController] Recording kick for chat: {}", chatId);
        statsService.incrementKicks(chatId);
        return ResponseEntity.ok().build();
    }
}
