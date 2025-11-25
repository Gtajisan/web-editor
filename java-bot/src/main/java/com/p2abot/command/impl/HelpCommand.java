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
public class HelpCommand implements Command {
    private final TelegramBotService botService;

    @Override
    public String getCommand() {
        return "/help";
    }

    @Override
    public String getDescription() {
        return "Display all available commands";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("❓ [HelpCommand] Executing help command");
        
        String helpText = """
            📖 **P2A-Bot v2 - Rose-Bot Inspired (23 Commands)**
            
            **🔐 Moderation:**
            /ban <user_id> - Ban user
            /unban <user_id> - Unban user
            /kick <user_id> - Kick user
            /warn <user_id> - Warn user
            /clearwarns <user_id> - Clear warnings
            /mute <user_id> - Mute user
            /unmute <user_id> - Unmute user
            /purge <count> - Delete messages
            
            **📌 Message Management:**
            /pin - Pin message
            /unpin - Unpin message
            /delete - Delete message
            
            **📝 Notes & Filters:**
            /note save|get|list|delete - Note management
            /filter add|list|remove - Content filters
            
            **🔧 Group Settings:**
            /welcome <msg> - Set welcome
            /antiflood on/off - Anti-spam
            /settings - View settings
            
            **👥 Information:**
            /userinfo [id] - User details
            /chatinfo - Chat info
            /adminlist - Show admins
            /stats - Statistics
            /logs - Recent logs
            /report - Report user
            
            **ℹ️ General:**
            /info - Bot info
            /help - This message
            /start - Welcome
            """;
        
        botService.sendMessage(chatId, helpText, null);
    }
}
