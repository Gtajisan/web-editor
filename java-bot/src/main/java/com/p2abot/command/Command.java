package com.p2abot.command;

import com.fasterxml.jackson.databind.JsonNode;

public interface Command {
    String getCommand();
    String getDescription();
    void execute(Long chatId, Long userId, String args, JsonNode message);
}
