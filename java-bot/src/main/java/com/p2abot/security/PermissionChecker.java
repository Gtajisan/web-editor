package com.p2abot.security;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PermissionChecker {
    
    public boolean isAdmin(JsonNode message, Long userId) {
        JsonNode from = message.get("from");
        if (from == null) return false;
        
        boolean isAdmin = from.has("is_bot") && !from.get("is_bot").asBoolean();
        log.debug("👤 [PermissionChecker] User {} admin check: {}", userId, isAdmin);
        return isAdmin;
    }
    
    public boolean isGroupChat(JsonNode message) {
        JsonNode chat = message.get("chat");
        if (chat == null) return false;
        
        String type = chat.get("type").asText();
        boolean isGroup = type.equals("group") || type.equals("supergroup");
        log.debug("💬 [PermissionChecker] Chat type: {}, is group: {}", type, isGroup);
        return isGroup;
    }
    
    public boolean isPrivateChat(JsonNode message) {
        JsonNode chat = message.get("chat");
        if (chat == null) return false;
        
        String type = chat.get("type").asText();
        boolean isPrivate = type.equals("private");
        log.debug("📧 [PermissionChecker] Chat type: {}, is private: {}", type, isPrivate);
        return isPrivate;
    }
    
    public boolean canExecuteInGroup(JsonNode message, String commandType) {
        if (!isGroupChat(message)) return true;
        
        // Admin commands only in groups
        if (commandType.equals("ADMIN")) {
            return isAdmin(message, getFromUserId(message));
        }
        
        // Most commands can be used in groups
        return true;
    }
    
    public boolean canExecuteInDM(JsonNode message) {
        if (!isPrivateChat(message)) return false;
        return true;
    }
    
    public Long getFromUserId(JsonNode message) {
        JsonNode from = message.get("from");
        if (from == null) return null;
        return from.get("id").asLong();
    }
    
    public Long getChatId(JsonNode message) {
        JsonNode chat = message.get("chat");
        if (chat == null) return null;
        return chat.get("id").asLong();
    }
    
    public String getChatType(JsonNode message) {
        JsonNode chat = message.get("chat");
        if (chat == null) return "unknown";
        return chat.get("type").asText();
    }
}
