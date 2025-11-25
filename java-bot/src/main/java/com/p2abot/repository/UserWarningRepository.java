package com.p2abot.repository;

import com.p2abot.model.UserWarning;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserWarningRepository extends JpaRepository<UserWarning, String> {
    List<UserWarning> findByChatIdAndUserId(Long chatId, Long userId);
    Optional<UserWarning> findByIdAndChatId(String id, Long chatId);
}
