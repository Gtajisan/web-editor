package com.p2abot.command.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.p2abot.command.Command;
import com.p2abot.service.BotNoteService;
import com.p2abot.service.TelegramBotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class NoteCommand implements Command {
    private final TelegramBotService botService;
    private final BotNoteService noteService;

    @Override
    public String getCommand() {
        return "/note";
    }

    @Override
    public String getDescription() {
        return "Manage group notes";
    }

    @Override
    public void execute(Long chatId, Long userId, String args, JsonNode message) {
        log.info("📝 [NoteCommand] Processing note command");
        
        String[] parts = args.split(" ", 2);
        if (parts.length == 0) {
            botService.sendMessage(chatId, "❓ Usage: /note save|get|list|delete [args]", null);
            return;
        }
        
        String action = parts[0].toLowerCase();
        String content = parts.length > 1 ? parts[1] : "";
        
        switch (action) {
            case "save" -> handleSave(chatId, content);
            case "get" -> handleGet(chatId, content);
            case "list" -> handleList(chatId);
            case "delete" -> handleDelete(chatId, content);
            default -> botService.sendMessage(chatId, "❓ Invalid action. Use: save, get, list, delete", null);
        }
    }

    private void handleSave(Long chatId, String content) {
        String[] parts = content.split(" ", 2);
        if (parts.length < 2) {
            botService.sendMessage(chatId, "❓ Usage: /note save <key> <content>", null);
            return;
        }
        
        log.info("💾 [NoteCommand] Saving note with key: {}", parts[0]);
        noteService.saveNote(chatId, parts[0], parts[1]);
        botService.sendMessage(chatId, "✅ Note saved successfully", null);
    }

    private void handleGet(Long chatId, String key) {
        if (key.trim().isEmpty()) {
            botService.sendMessage(chatId, "❓ Usage: /note get <key>", null);
            return;
        }
        
        log.info("🔍 [NoteCommand] Fetching note: {}", key);
        var note = noteService.getNote(chatId, key);
        
        if (note.isPresent()) {
            botService.sendMessage(chatId, "📝 " + note.get().getNoteContent(), null);
        } else {
            botService.sendMessage(chatId, "❌ Note not found", null);
        }
    }

    private void handleList(Long chatId) {
        log.info("📋 [NoteCommand] Listing all notes");
        var notes = noteService.getAllNotes(chatId);
        
        if (notes.isEmpty()) {
            botService.sendMessage(chatId, "📋 No notes saved yet", null);
            return;
        }
        
        StringBuilder sb = new StringBuilder("📋 **Saved Notes:**\n\n");
        notes.forEach(n -> sb.append(String.format("• `%s`\n", n.getNoteKey())));
        botService.sendMessage(chatId, sb.toString(), null);
    }

    private void handleDelete(Long chatId, String key) {
        if (key.trim().isEmpty()) {
            botService.sendMessage(chatId, "❓ Usage: /note delete <key>", null);
            return;
        }
        
        log.warn("🗑️ [NoteCommand] Deleting note: {}", key);
        noteService.deleteNote(chatId, key);
        botService.sendMessage(chatId, "✅ Note deleted", null);
    }
}
