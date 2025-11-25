package com.p2abot.repository;

import com.p2abot.model.UserRules;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRulesRepository extends JpaRepository<UserRules, String> {
    Optional<UserRules> findByChatIdAndUserId(Long chatId, Long userId);
    List<UserRules> findByChatId(Long chatId);
}
