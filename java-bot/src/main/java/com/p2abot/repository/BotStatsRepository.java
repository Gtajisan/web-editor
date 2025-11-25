package com.p2abot.repository;

import com.p2abot.model.BotStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BotStatsRepository extends JpaRepository<BotStats, Long> {
    Optional<BotStats> findByChatId(Long chatId);
}
