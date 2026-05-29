# Stage 1: Build the application
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app

# Copy the pom.xml and download dependencies first (for caching)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and build the application, skipping tests
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create the lightweight runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the compiled JAR file from the builder stage
# We use *.jar to match the artifact without needing the exact version number
COPY --from=builder /app/target/*.jar app.jar

# Expose the requested port
EXPOSE 8085

# Define the entry point command to execute the application
ENTRYPOINT ["java", "-jar", "app.jar"]
