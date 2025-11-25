package com.p2abot.service;

import com.p2abot.model.UserWarning;
import com.p2abot.repository.UserWarningRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserWarningService {
    private final UserWarningRepository warningRepository;

    public UserWarning addWarning(Long chatId, Long userId, String reason) {
        log.info("⚠️ [WarningService] Adding warning - Chat: {}, User: {}, Reason: {}", chatId, userId, reason);
        
        List<UserWarning> existing = warningRepository.findByChatIdAndUserId(chatId, userId);
        Integer count = existing.isEmpty() ? 1 : existing.get(0).getWarningCount() + 1;
        
        UserWarning warning = UserWarning.builder()
            .chatId(chatId)
            .userId(userId)
            .reason(reason)
            .warningCount(count)
            .build();
        
        return warningRepository.save(warning);
    }

    public Integer getWarningCount(Long chatId, Long userId) {
        List<UserWarning> warnings = warningRepository.findByChatIdAndUserId(chatId, userId);
        return warnings.isEmpty() ? 0 : warnings.get(0).getWarningCount();
    }

    public void clearWarnings(Long chatId, Long userId) {
        log.info("✅ [WarningService] Clearing warnings - Chat: {}, User: {}", chatId, userId);
        List<UserWarning> warnings = warningRepository.findByChatIdAndUserId(chatId, userId);
        warnings.forEach(warningRepository::delete);
    }
}
