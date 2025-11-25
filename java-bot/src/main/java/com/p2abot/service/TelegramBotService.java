package com.p2abot.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class TelegramBotService {
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${telegram.bot.token}")
    private String botToken;

    private static final String TELEGRAM_API_URL = "https://api.telegram.org/bot";

    public boolean sendMessage(Long chatId, String text, Integer replyToMessageId) {
        log.info("📤 [TelegramBotService] Sending message to chat: {}", chatId);

        try {
            String url = TELEGRAM_API_URL + botToken + "/sendMessage";

            Map<String, Object> params = new HashMap<>();
            params.put("chat_id", chatId);
            params.put("text", text);
            
            if (replyToMessageId != null) {
                Map<String, Object> replyParams = new HashMap<>();
                replyParams.put("message_id", replyToMessageId);
                params.put("reply_parameters", replyParams);
            }

            var response = restTemplate.postForObject(url, params, Map.class);
            
            if (response != null && (Boolean) response.getOrDefault("ok", false)) {
                log.info("✅ [TelegramBotService] Message sent successfully");
                return true;
            } else {
                log.error("❌ [TelegramBotService] Failed to send message");
                return false;
            }
        } catch (Exception e) {
            log.error("❌ [TelegramBotService] Error sending message: {}", e.getMessage());
            return false;
        }
    }

    public boolean banUser(Long chatId, Long userId) {
        log.warn("🚫 [TelegramBotService] Banning user {} from chat {}", userId, chatId);

        try {
            String url = TELEGRAM_API_URL + botToken + "/banChatMember";

            Map<String, Object> params = new HashMap<>();
            params.put("chat_id", chatId);
            params.put("user_id", userId);

            var response = restTemplate.postForObject(url, params, Map.class);
            
            return response != null && (Boolean) response.getOrDefault("ok", false);
        } catch (Exception e) {
            log.error("❌ [TelegramBotService] Error banning user: {}", e.getMessage());
            return false;
        }
    }

    public boolean kickUser(Long chatId, Long userId) {
        log.warn("👢 [TelegramBotService] Kicking user {} from chat {}", userId, chatId);

        try {
            String url = TELEGRAM_API_URL + botToken + "/kickChatMember";

            Map<String, Object> params = new HashMap<>();
            params.put("chat_id", chatId);
            params.put("user_id", userId);

            var response = restTemplate.postForObject(url, params, Map.class);
            
            return response != null && (Boolean) response.getOrDefault("ok", false);
        } catch (Exception e) {
            log.error("❌ [TelegramBotService] Error kicking user: {}", e.getMessage());
            return false;
        }
    }

    public boolean deleteMessage(Long chatId, Integer messageId) {
        log.info("🗑️ [TelegramBotService] Deleting message {} from chat {}", messageId, chatId);

        try {
            String url = TELEGRAM_API_URL + botToken + "/deleteMessage";

            Map<String, Object> params = new HashMap<>();
            params.put("chat_id", chatId);
            params.put("message_id", messageId);

            var response = restTemplate.postForObject(url, params, Map.class);
            
            return response != null && (Boolean) response.getOrDefault("ok", false);
        } catch (Exception e) {
            log.error("❌ [TelegramBotService] Error deleting message: {}", e.getMessage());
            return false;
        }
    }

    public boolean pinMessage(Long chatId, Integer messageId) {
        log.info("📌 [TelegramBotService] Pinning message {} in chat {}", messageId, chatId);

        try {
            String url = TELEGRAM_API_URL + botToken + "/pinChatMessage";

            Map<String, Object> params = new HashMap<>();
            params.put("chat_id", chatId);
            params.put("message_id", messageId);

            var response = restTemplate.postForObject(url, params, Map.class);
            
            return response != null && (Boolean) response.getOrDefault("ok", false);
        } catch (Exception e) {
            log.error("❌ [TelegramBotService] Error pinning message: {}", e.getMessage());
            return false;
        }
    }
}
