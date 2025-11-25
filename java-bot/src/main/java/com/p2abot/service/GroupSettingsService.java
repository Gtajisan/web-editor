package com.p2abot.service;

import com.p2abot.model.GroupSettings;
import com.p2abot.repository.GroupSettingsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class GroupSettingsService {
    private final GroupSettingsRepository settingsRepository;
    
    public GroupSettings getOrCreateSettings(Long chatId) {
        log.info("⚙️ [GroupSettingsService] Getting settings for chat: {}", chatId);
        return settingsRepository.findByChatId(chatId).orElseGet(() -> {
            GroupSettings settings = new GroupSettings();
            settings.setChatId(chatId);
            return settingsRepository.save(settings);
        });
    }
    
    public void updateSetting(Long chatId, String key, Object value) {
        log.info("🔧 [GroupSettingsService] Updating {} = {}", key, value);
        GroupSettings settings = getOrCreateSettings(chatId);
        
        switch (key) {
            case "antiflood" -> settings.setAntiFloodEnabled((Boolean) value);
            case "welcome" -> settings.setWelcomeEnabled((Boolean) value);
            case "welcome_msg" -> settings.setWelcomeMessage((String) value);
            case "auto_warn" -> settings.setAutoWarnEnabled((Boolean) value);
            case "auto_ban" -> settings.setAutoBanEnabled((Boolean) value);
            case "rules" -> settings.setRulesText((String) value);
        }
        
        settings.setUpdatedAt(LocalDateTime.now());
        settingsRepository.save(settings);
    }
    
    public void setRules(Long chatId, String rules) {
        log.info("📝 [GroupSettingsService] Setting rules for chat: {}", chatId);
        GroupSettings settings = getOrCreateSettings(chatId);
        settings.setRulesText(rules);
        settings.setUpdatedAt(LocalDateTime.now());
        settingsRepository.save(settings);
    }
    
    public String getRules(Long chatId) {
        GroupSettings settings = getOrCreateSettings(chatId);
        return settings.getRulesText() != null ? settings.getRulesText() : "No rules set";
    }
}
