# --- Build stage ---
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY pom.xml .
COPY src src
RUN apt-get update && apt-get install -y maven && \
    mvn package -DskipTests -q

# --- Runtime stage ---
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# curl for Docker healthcheck, ffmpeg for waveform generation, data directories
RUN apt-get update && apt-get install -y --no-install-recommends curl ffmpeg && rm -rf /var/lib/apt/lists/* && \
    mkdir -p /app/data/covers /app/data/waveforms

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
