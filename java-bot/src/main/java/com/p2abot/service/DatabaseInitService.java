package com.p2abot.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;

@Slf4j
@Service
@RequiredArgsConstructor
public class DatabaseInitService implements CommandLineRunner {
    private final DataSource dataSource;

    @Override
    public void run(String... args) throws Exception {
        log.info("📊 [DatabaseInitService] Initializing database...");
        try (Connection conn = dataSource.getConnection()) {
            DatabaseMetaData meta = conn.getMetaData();
            
            log.info("🔍 [DatabaseInitService] Checking existing tables...");
            ResultSet tables = meta.getTables(null, null, "%", new String[]{"TABLE"});
            
            int tableCount = 0;
            while (tables.next()) {
                tableCount++;
                log.info("  ✓ Table: {}", tables.getString("TABLE_NAME"));
            }
            
            if (tableCount == 0) {
                log.warn("⚠️ [DatabaseInitService] No tables found. Hibernate will create them on first use.");
            }
            
            log.info("✅ [DatabaseInitService] Database initialized successfully");
            log.info("📁 [DatabaseInitService] Database location: {}", getDatabasePath());
        } catch (Exception e) {
            log.error("❌ [DatabaseInitService] Database initialization failed: {}", e.getMessage(), e);
        }
    }

    private String getDatabasePath() {
        return System.getProperty("user.dir") + "/p2a-bot-data.db";
    }
}
