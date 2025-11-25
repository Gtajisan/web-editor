FROM maven:3.9-eclipse-temurin-21 as builder
WORKDIR /build
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /build/target/*.jar app.jar

ENV TELEGRAM_BOT_TOKEN=""
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
