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
public class RulesCommand implements Command {
    private final TelegramBotService botService;
    private final PermissionChecker permissionChecker;
    private final GroupSettingsService settingsService;

    @Override
    public String getCommand() {
        return "/rules";
    }

    @Override
    public String getDescription() {
        return "View or set group rules (Admin only to set)";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("📋 [RulesCommand] Processing rules command");
        
        String[] parts = args.split(" ", 1);
        
        // Set rules: admin only in groups
        if (parts.length > 0 && (parts[0].equals("set") || parts[0].equals("add"))) {
            if (permissionChecker.isGroupChat(message) && 
                !permissionChecker.isAdmin(message, userId)) {
                botService.sendMessage(chatId, "❌ Admin only - can't set rules", null);
                return;
            }
            
            if (parts.length > 1) {
                String rulesText = parts[1];
                settingsService.setRules(chatId, rulesText);
                botService.sendMessage(chatId, "✅ Rules updated", null);
                log.info("📝 Rules set for chat: {}", chatId);
            }
            return;
        }
        
        // View rules: anyone can view
        String rules = settingsService.getRules(chatId);
        String rulesDisplay = "📋 **Group Rules**\n\n" + rules;
        botService.sendMessage(chatId, rulesDisplay, null);
    }
}
