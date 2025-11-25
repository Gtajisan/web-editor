package com.p2abot.command.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.p2abot.command.Command;
import com.p2abot.security.PermissionChecker;
import com.p2abot.service.TelegramBotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DashboardCommand implements Command {
    private final TelegramBotService botService;
    private final PermissionChecker permissionChecker;

    @Override
    public String getCommand() {
        return "/dashboard";
    }

    @Override
    public String getDescription() {
        return "Access bot dashboard (DM only for users, admin in groups)";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("📊 [DashboardCommand] Dashboard request");
        
        // DM access: anyone
        if (permissionChecker.isPrivateChat(message)) {
            String dmDashboard = "📊 **Your Personal Dashboard**\n\n" +
                "🔗 Full Dashboard:\n" +
                "http://localhost:8080/advanced-dashboard.html\n\n" +
                "📈 Statistics:\n" +
                "http://localhost:8080/api/dashboard/stats/summary\n\n" +
                "⚡ Commands Info:\n" +
                "http://localhost:8080/api/dashboard/commands/stats";
            botService.sendMessage(chatId, dmDashboard, null);
            return;
        }
        
        // Group access: admin only
        if (permissionChecker.isGroupChat(message)) {
            if (!permissionChecker.isAdmin(message, userId)) {
                botService.sendMessage(chatId, "❌ Admin only in groups", null);
                return;
            }
            
            String groupDashboard = "📊 **Group Dashboard** (Admin View)\n\n" +
                "🔗 Full Dashboard:\n" +
                "http://localhost:8080/advanced-dashboard.html\n\n" +
                "📈 Group Statistics:\n" +
                "http://localhost:8080/api/dashboard/stats/summary\n\n" +
                "💾 Database Status:\n" +
                "http://localhost:8080/api/dashboard/system/info\n\n" +
                "🖥️ Console Logs:\n" +
                "http://localhost:8080/api/dashboard/logs/recent";
            botService.sendMessage(chatId, groupDashboard, null);
        }
    }
}
