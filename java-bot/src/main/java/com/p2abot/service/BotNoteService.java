package com.p2abot.service;

import com.p2abot.model.BotNote;
import com.p2abot.repository.BotNoteRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BotNoteService {
    private final BotNoteRepository noteRepository;

    public BotNote saveNote(Long chatId, String key, String content) {
        log.info("💾 [BotNoteService] Saving note - Chat: {}, Key: {}", chatId, key);
        
        Optional<BotNote> existing = noteRepository.findByChatIdAndNoteKey(chatId, key);
        BotNote note;
        
        if (existing.isPresent()) {
            note = existing.get();
            note.setNoteContent(content);
            log.info("📝 [BotNoteService] Updating existing note");
        } else {
            note = BotNote.builder()
                .chatId(chatId)
                .noteKey(key)
                .noteContent(content)
                .build();
            log.info("✨ [BotNoteService] Creating new note");
        }
        
        return noteRepository.save(note);
    }

    public Optional<BotNote> getNote(Long chatId, String key) {
        log.debug("🔍 [BotNoteService] Fetching note - Chat: {}, Key: {}", chatId, key);
        return noteRepository.findByChatIdAndNoteKey(chatId, key);
    }

    public List<BotNote> getAllNotes(Long chatId) {
        log.info("📋 [BotNoteService] Fetching all notes for chat: {}", chatId);
        return noteRepository.findByChatId(chatId);
    }

    public void deleteNote(Long chatId, String key) {
        log.warn("🗑️ [BotNoteService] Deleting note - Chat: {}, Key: {}", chatId, key);
        noteRepository.deleteByChatIdAndNoteKey(chatId, key);
    }
}
