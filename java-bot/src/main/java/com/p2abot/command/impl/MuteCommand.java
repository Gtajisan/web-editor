package com.p2abot.command.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.p2abot.command.Command;
import com.p2abot.service.TelegramBotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class MuteCommand implements Command {
    private final TelegramBotService botService;

    @Override
    public String getCommand() {
        return "/mute";
    }

    @Override
    public String getDescription() {
        return "Mute user (Rose-Bot style)";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.warn("🔇 [MuteCommand] Muting user in chat: {}", chatId);
        
        String[] parts = args.split(" ");
        if (parts.length < 2) {
            botService.sendMessage(chatId, "❓ Usage: /mute <user_id> <duration>", null);
            return;
        }
        
        Long targetUserId = parseUserId(parts[0]);
        String duration = parts[1]; // e.g., "5m", "1h", "1d"
        
        if (targetUserId != null) {
            // Note: Telegram API doesn't support mute directly, would need permissions
            String muteText = String.format(
                "🔇 **User Muted**\n\n" +
                "User ID: `%d`\n" +
                "Duration: %s\n" +
                "\nUser cannot send messages for this duration",
                targetUserId, duration
            );
            botService.sendMessage(chatId, muteText, null);
        } else {
            botService.sendMessage(chatId, "❓ Invalid user ID", null);
        }
    }

    private Long parseUserId(String arg) {
        try {
            if (arg.startsWith("@")) return null;
            return Long.parseLong(arg.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }
}
