package com.p2abot.service;

import com.p2abot.model.GroupSettings;
import com.p2abot.model.UserRules;
import com.p2abot.repository.UserRulesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class AutomationService {
    private final UserRulesRepository userRulesRepository;
    private final GroupSettingsService groupSettingsService;
    private final TelegramBotService botService;
    
    public void handleAutoWarning(Long chatId, Long userId, GroupSettings settings) {
        log.info("⚠️ [AutomationService] Auto-warning system triggered");
        
        if (!settings.getAutoWarnEnabled()) {
            log.debug("Auto-warn disabled");
            return;
        }
        
        UserRules rules = userRulesRepository.findByChatIdAndUserId(chatId, userId)
            .orElse(new UserRules());
        
        rules.setChatId(chatId);
        rules.setUserId(userId);
        rules.setWarningCount(rules.getWarningCount() + 1);
        
        log.info("⚠️ Warning count for user {}: {}", userId, rules.getWarningCount());
        
        if (settings.getAutoBanEnabled() && 
            rules.getWarningCount() >= settings.getAutoBanAfterWarnings()) {
            handleAutoBan(chatId, userId, settings);
        } else if (settings.getAutoMuteEnabled()) {
            handleAutoMute(chatId, userId, settings);
        }
        
        rules.setUpdatedAt(LocalDateTime.now());
        userRulesRepository.save(rules);
    }
    
    private void handleAutoBan(Long chatId, Long userId, GroupSettings settings) {
        log.info("🔨 [AutomationService] Auto-banning user: {}", userId);
        UserRules rules = userRulesRepository.findByChatIdAndUserId(chatId, userId)
            .orElse(new UserRules());
        rules.setBanned(true);
        rules.setUpdatedAt(LocalDateTime.now());
        userRulesRepository.save(rules);
    }
    
    private void handleAutoMute(Long chatId, Long userId, GroupSettings settings) {
        log.info("🔇 [AutomationService] Auto-muting user: {}", userId);
        UserRules rules = userRulesRepository.findByChatIdAndUserId(chatId, userId)
            .orElse(new UserRules());
        rules.setMuted(true);
        rules.setMutedUntil(System.currentTimeMillis() + 
            (settings.getAutoMuteDuration() * 60 * 1000L));
        rules.setUpdatedAt(LocalDateTime.now());
        userRulesRepository.save(rules);
    }
    
    public void checkAndEnforceMutes(Long chatId) {
        log.info("🔍 [AutomationService] Checking muted users");
        long now = System.currentTimeMillis();
        
        var mutedUsers = userRulesRepository.findByChatId(chatId).stream()
            .filter(r -> r.getMuted() && r.getMutedUntil() < now)
            .toList();
        
        for (UserRules rules : mutedUsers) {
            rules.setMuted(false);
            rules.setUpdatedAt(LocalDateTime.now());
            userRulesRepository.save(rules);
            log.info("✅ User {} unmuted", rules.getUserId());
        }
    }
}
