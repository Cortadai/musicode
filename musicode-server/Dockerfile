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

# Data directories
RUN mkdir -p /app/data/covers

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
