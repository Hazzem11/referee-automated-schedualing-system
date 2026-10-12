# 1. Build the React frontend
FROM node:22-alpine AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY public ./public
COPY src ./src
RUN npm run build

# 2. Build the Spring Boot backend with the frontend bundled as static assets
FROM maven:3.9-eclipse-temurin-17 AS backend
WORKDIR /app
COPY pom.xml ./
RUN mvn -q -B dependency:go-offline
COPY src/main ./src/main
COPY --from=frontend /app/build ./src/main/resources/static
RUN mvn -q -B package -DskipTests

# 3. Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=backend /app/target/referee-availability-1.0-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
