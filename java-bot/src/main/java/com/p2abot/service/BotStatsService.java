package com.p2abot.service;

import com.p2abot.model.BotStats;
import com.p2abot.repository.BotStatsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BotStatsService {
    private final BotStatsRepository statsRepository;

    public BotStats getOrCreateStats(Long chatId) {
        log.debug("📊 [StatsService] Getting/creating stats for chat: {}", chatId);
        
        Optional<BotStats> existing = statsRepository.findByChatId(chatId);
        if (existing.isPresent()) {
            return existing.get();
        }
        
        BotStats stats = BotStats.builder()
            .chatId(chatId)
            .totalMessages(0L)
            .usersWarned(0L)
            .usersKicked(0L)
            .usersBanned(0L)
            .notesSaved(0L)
            .build();
        
        return statsRepository.save(stats);
    }

    public void incrementMessages(Long chatId) {
        BotStats stats = getOrCreateStats(chatId);
        stats.setTotalMessages(stats.getTotalMessages() + 1);
        statsRepository.save(stats);
    }

    public void incrementWarnings(Long chatId) {
        BotStats stats = getOrCreateStats(chatId);
        stats.setUsersWarned(stats.getUsersWarned() + 1);
        statsRepository.save(stats);
    }

    public void incrementBans(Long chatId) {
        BotStats stats = getOrCreateStats(chatId);
        stats.setUsersBanned(stats.getUsersBanned() + 1);
        statsRepository.save(stats);
    }

    public void incrementKicks(Long chatId) {
        BotStats stats = getOrCreateStats(chatId);
        stats.setUsersKicked(stats.getUsersKicked() + 1);
        statsRepository.save(stats);
    }

    public BotStats getStats(Long chatId) {
        return getOrCreateStats(chatId);
    }
}
