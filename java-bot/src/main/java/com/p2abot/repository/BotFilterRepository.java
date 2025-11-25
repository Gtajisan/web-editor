package com.p2abot.repository;

import com.p2abot.model.BotFilter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BotFilterRepository extends JpaRepository<BotFilter, String> {
    List<BotFilter> findByChatId(Long chatId);
    void deleteByChatIdAndId(Long chatId, String id);
}
