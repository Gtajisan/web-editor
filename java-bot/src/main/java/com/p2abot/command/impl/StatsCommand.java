package com.p2abot.command.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.p2abot.command.Command;
import com.p2abot.model.BotStats;
import com.p2abot.service.BotStatsService;
import com.p2abot.service.TelegramBotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class StatsCommand implements Command {
    private final TelegramBotService botService;
    private final BotStatsService statsService;

    @Override
    public String getCommand() {
        return "/stats";
    }

    @Override
    public String getDescription() {
        return "Display chat statistics";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("📊 [StatsCommand] Fetching stats for chat: {}", chatId);
        
        BotStats stats = statsService.getStats(chatId);
        
        String statsText = String.format(
            "📊 **P2A-Bot Statistics**\n\n" +
            "💬 Total Messages: %d\n" +
            "⚠️ Users Warned: %d\n" +
            "👢 Users Kicked: %d\n" +
            "🚫 Users Banned: %d\n" +
            "📝 Notes Saved: %d",
            stats.getTotalMessages(),
            stats.getUsersWarned(),
            stats.getUsersKicked(),
            stats.getUsersBanned(),
            stats.getNotesSaved()
        );
        
        botService.sendMessage(chatId, statsText, null);
    }
}
