package com.p2abot;

import com.p2abot.command.CommandHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@Slf4j
@SpringBootApplication
@EnableAsync
@RequiredArgsConstructor
public class P2ABotApplication implements CommandLineRunner {
    private final CommandHandler commandHandler;

    public static void main(String[] args) {
        log.info("🚀 Starting P2A-Bot v2 (Java GOAT Edition)...");
        SpringApplication.run(P2ABotApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        log.info("✅ P2A-Bot v2 started successfully");
        commandHandler.init();
    }
}
