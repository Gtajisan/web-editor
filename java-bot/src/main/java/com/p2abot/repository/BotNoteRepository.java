package com.p2abot.repository;

import com.p2abot.model.BotNote;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BotNoteRepository extends JpaRepository<BotNote, String> {
    List<BotNote> findByChatId(Long chatId);
    Optional<BotNote> findByChatIdAndNoteKey(Long chatId, String noteKey);
    void deleteByChatIdAndNoteKey(Long chatId, String noteKey);
}
