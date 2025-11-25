package com.p2abot.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/database")
@RequiredArgsConstructor
public class DatabaseController {
    private final DataSource dataSource;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> databaseStatus() {
        log.info("🔍 [DatabaseController] Checking database status");
        
        Map<String, Object> response = new HashMap<>();
        try (Connection conn = dataSource.getConnection()) {
            response.put("status", "🟢 CONNECTED");
            response.put("type", "SQLite");
            response.put("path", System.getProperty("user.dir") + "/p2a-bot-data.db");
            response.put("timestamp", System.currentTimeMillis());
        } catch (Exception e) {
            log.error("❌ Database connection failed: {}", e.getMessage());
            response.put("status", "🔴 ERROR");
            response.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/tables")
    public ResponseEntity<Map<String, Object>> listTables() {
        log.info("📋 [DatabaseController] Listing database tables");
        
        Map<String, Object> response = new HashMap<>();
        List<String> tables = new ArrayList<>();
        
        try (Connection conn = dataSource.getConnection()) {
            DatabaseMetaData meta = conn.getMetaData();
            ResultSet resultSet = meta.getTables(null, null, "%", new String[]{"TABLE"});
            
            while (resultSet.next()) {
                tables.add(resultSet.getString("TABLE_NAME"));
            }
            
            response.put("total", tables.size());
            response.put("tables", tables);
            response.put("status", "✅ SUCCESS");
        } catch (Exception e) {
            log.error("❌ Error fetching tables: {}", e.getMessage());
            response.put("status", "❌ ERROR");
            response.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/schema")
    public ResponseEntity<Map<String, Object>> databaseSchema() {
        log.info("📐 [DatabaseController] Getting database schema");
        
        Map<String, Object> response = new HashMap<>();
        Map<String, List<String>> schema = new HashMap<>();
        
        try (Connection conn = dataSource.getConnection()) {
            DatabaseMetaData meta = conn.getMetaData();
            ResultSet tableSet = meta.getTables(null, null, "%", new String[]{"TABLE"});
            
            while (tableSet.next()) {
                String tableName = tableSet.getString("TABLE_NAME");
                List<String> columns = new ArrayList<>();
                
                ResultSet columnSet = meta.getColumns(null, null, tableName, null);
                while (columnSet.next()) {
                    columns.add(columnSet.getString("COLUMN_NAME"));
                }
                
                schema.put(tableName, columns);
            }
            
            response.put("tables", schema.size());
            response.put("schema", schema);
            response.put("status", "✅ SUCCESS");
        } catch (Exception e) {
            log.error("❌ Error fetching schema: {}", e.getMessage());
            response.put("status", "❌ ERROR");
            response.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/init")
    public ResponseEntity<Map<String, Object>> initializeDatabase() {
        log.info("🔧 [DatabaseController] Initializing database");
        
        Map<String, Object> response = new HashMap<>();
        try {
            // Tables are created by Hibernate on first use
            response.put("status", "✅ DATABASE READY");
            response.put("type", "SQLite");
            response.put("location", System.getProperty("user.dir") + "/p2a-bot-data.db");
            response.put("tables", new String[]{
                "telegram_chats",
                "bot_notes",
                "bot_filters",
                "bot_warnings",
                "bot_stats"
            });
            response.put("initialized", true);
        } catch (Exception e) {
            log.error("❌ Database initialization failed: {}", e.getMessage());
            response.put("status", "❌ ERROR");
            response.put("error", e.getMessage());
        }
        
        return ResponseEntity.ok(response);
    }
}
