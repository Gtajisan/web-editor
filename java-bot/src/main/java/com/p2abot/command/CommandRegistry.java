package com.p2abot.command;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class CommandRegistry {
    private final Map<String, Command> commands = new HashMap<>();

    public void register(Command command) {
        log.info("📝 [CommandRegistry] Registering command: {}", command.getCommand());
        commands.put(command.getCommand().toLowerCase(), command);
    }

    public Command getCommand(String name) {
        return commands.get(name.toLowerCase());
    }

    public boolean hasCommand(String name) {
        return commands.containsKey(name.toLowerCase());
    }

    public void listCommands() {
        log.info("📋 [CommandRegistry] Available commands:");
        commands.forEach((name, cmd) -> 
            log.info("  {} - {}", name, cmd.getDescription())
        );
    }
}
