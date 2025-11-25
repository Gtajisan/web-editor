package com.p2abot.command;

import com.fasterxml.jackson.databind.JsonNode;
import com.p2abot.command.impl.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CommandHandler {
    private final CommandRegistry registry;
    private final StartCommand startCommand;
    private final HelpCommand helpCommand;
    private final StatsCommand statsCommand;
    private final BanCommand banCommand;
    private final KickCommand kickCommand;
    private final UnbanCommand unbanCommand;
    private final WarnCommand warnCommand;
    private final MuteCommand muteCommand;
    private final UnmuteCommand unmuteCommand;
    private final PurgeCommand purgeCommand;
    private final NoteCommand noteCommand;
    private final WelcomeCommand welcomeCommand;
    private final FilterCommand filterCommand;
    private final InfoCommand infoCommand;
    private final ChatinfoCommand chatinfoCommand;
    private final UserinfoCommand userinfoCommand;
    private final ReportCommand reportCommand;
    private final AdminlistCommand adminlistCommand;
    private final AntifloodCommand antifloodCommand;
    private final PinCommand pinCommand;
    private final UnpinCommand unpinCommand;
    private final ClearwarnsCommand clearwarnsCommand;
    private final LogsCommand logsCommand;
    private final SettingsCommand settingsCommand;
    private final DashboardCommand dashboardCommand;
    private final RulesCommand rulesCommand;

    public void init() {
        log.info("🚀 [CommandHandler] Initializing P2A-Bot command handlers...");
        registry.register(startCommand);
        registry.register(helpCommand);
        registry.register(statsCommand);
        registry.register(banCommand);
        registry.register(kickCommand);
        registry.register(unbanCommand);
        registry.register(warnCommand);
        registry.register(muteCommand);
        registry.register(unmuteCommand);
        registry.register(purgeCommand);
        registry.register(noteCommand);
        registry.register(welcomeCommand);
        registry.register(filterCommand);
        registry.register(infoCommand);
        registry.register(chatinfoCommand);
        registry.register(userinfoCommand);
        registry.register(reportCommand);
        registry.register(adminlistCommand);
        registry.register(antifloodCommand);
        registry.register(pinCommand);
        registry.register(unpinCommand);
        registry.register(clearwarnsCommand);
        registry.register(logsCommand);
        registry.register(settingsCommand);
        registry.register(dashboardCommand);
        registry.register(rulesCommand);
        registry.listCommands();
        log.info("✅ [CommandHandler] 25 commands registered successfully");
    }

    public void handleCommand(Long chatId, Long userId, String commandText, JsonNode message) {
        log.info("⚡ [CommandHandler] Processing command: {}", commandText);
        
        String[] parts = commandText.split(" ", 2);
        String commandName = parts[0].toLowerCase();
        String args = parts.length > 1 ? parts[1] : "";

        if (registry.hasCommand(commandName)) {
            try {
                Command cmd = registry.getCommand(commandName);
                cmd.execute(chatId, userId, args, message);
            } catch (Exception e) {
                log.error("❌ [CommandHandler] Error executing command {}: {}", commandName, e.getMessage(), e);
            }
        } else {
            log.debug("❓ [CommandHandler] Unknown command: {}", commandName);
        }
    }
}
