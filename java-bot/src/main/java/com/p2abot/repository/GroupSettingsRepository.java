package com.p2abot.repository;

import com.p2abot.model.GroupSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GroupSettingsRepository extends JpaRepository<GroupSettings, String> {
    Optional<GroupSettings> findByChatId(Long chatId);
}
