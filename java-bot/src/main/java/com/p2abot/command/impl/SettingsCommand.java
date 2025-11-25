package com.p2abot.command.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.p2abot.command.Command;
import com.p2abot.security.PermissionChecker;
import com.p2abot.service.TelegramBotService;
import com.p2abot.service.GroupSettingsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class SettingsCommand implements Command {
    private final TelegramBotService botService;
    private final PermissionChecker permissionChecker;
    private final GroupSettingsService settingsService;

    @Override
    public String getCommand() {
        return "/settings";
    }

    @Override
    public String getDescription() {
        return "View/modify bot settings (Admin only in groups)";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("⚙️ [SettingsCommand] Processing settings");
        
        // For groups: admin only
        if (permissionChecker.isGroupChat(message) && 
            !permissionChecker.isAdmin(message, userId)) {
            botService.sendMessage(chatId, "❌ Admin only command in groups", null);
            return;
        }
        
        // For DM: anyone can view
        if (permissionChecker.isPrivateChat(message)) {
            String dmSettings = "⚙️ **Bot Settings (Personal)**\n\n" +
                "Available features:\n" +
                "• Notifications settings\n" +
                "• Privacy settings\n" +
                "• Dashboard access\n" +
                "• Command preferences";
            botService.sendMessage(chatId, dmSettings, null);
            return;
        }
        
        // For groups: admin settings
        var settings = settingsService.getOrCreateSettings(chatId);
        
        String settingsText = String.format(
            "⚙️ **Group Settings**\n\n" +
            "🚫 Antiflood: %s\n" +
            "👋 Welcome: %s\n" +
            "⚠️ Auto-warn: %s\n" +
            "🔨 Auto-ban: %s\n" +
            "🔇 Auto-mute: %s\n\n" +
            "Use:\n" +
            "/settings antiflood on/off\n" +
            "/settings welcome <message>\n" +
            "/settings rules <text>",
            settings.getAntiFloodEnabled() ? "ON" : "OFF",
            settings.getWelcomeEnabled() ? "ON" : "OFF",
            settings.getAutoWarnEnabled() ? "ON" : "OFF",
            settings.getAutoBanEnabled() ? "ON" : "OFF",
            settings.getAutoMuteEnabled() ? "ON" : "OFF"
        );
        
        botService.sendMessage(chatId, settingsText, null);
    }
}
