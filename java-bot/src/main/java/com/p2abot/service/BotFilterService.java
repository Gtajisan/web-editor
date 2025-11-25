package com.p2abot.service;

import com.p2abot.model.BotFilter;
import com.p2abot.repository.BotFilterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BotFilterService {
    private final BotFilterRepository filterRepository;

    public BotFilter addFilter(Long chatId, String pattern, String replacement, Boolean regex) {
        log.info("🔧 [BotFilterService] Adding filter - Chat: {}, Pattern: {}", chatId, pattern);
        
        BotFilter filter = BotFilter.builder()
            .chatId(chatId)
            .pattern(pattern)
            .replacement(replacement)
            .regex(regex != null ? regex : false)
            .build();
        
        return filterRepository.save(filter);
    }

    public List<BotFilter> getFilters(Long chatId) {
        log.debug("📋 [BotFilterService] Fetching filters for chat: {}", chatId);
        return filterRepository.findByChatId(chatId);
    }

    public String applyFilters(Long chatId, String text) {
        log.debug("✏️ [BotFilterService] Applying filters to text");
        
        List<BotFilter> filters = getFilters(chatId);
        String result = text;
        
        for (BotFilter filter : filters) {
            try {
                if (Boolean.TRUE.equals(filter.getRegex())) {
                    result = result.replaceAll(filter.getPattern(), filter.getReplacement());
                } else {
                    result = result.replace(filter.getPattern(), filter.getReplacement());
                }
            } catch (Exception e) {
                log.error("❌ [BotFilterService] Error applying filter: {}", e.getMessage());
            }
        }
        
        return result;
    }

    public void deleteFilter(Long chatId, String filterId) {
        log.warn("🗑️ [BotFilterService] Deleting filter - Chat: {}, ID: {}", chatId, filterId);
        filterRepository.deleteByChatIdAndId(chatId, filterId);
    }
}
