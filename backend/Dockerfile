# ============================
# Étape 1 : Build avec Maven
# ============================
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /build

# Copier d'abord le pom.xml pour profiter du cache des dépendances
COPY pom.xml .

# Télécharger les dépendances (mis en cache tant que pom.xml ne change pas)
RUN mvn dependency:go-offline -B

# Copier les sources puis compiler
COPY src ./src
RUN mvn clean package -DskipTests -B

# ============================
# Étape 2 : Image finale légère
# ============================
FROM eclipse-temurin:21-jre-alpine

# Créer un utilisateur non-root (sécurité)
RUN addgroup -S spring && adduser -S spring -G spring

WORKDIR /app
COPY --from=builder /build/target/taskflow-backend-1.0.0.jar app.jar

# Changer de propriétaire
RUN chown spring:spring app.jar
USER spring

EXPOSE 8080

# Healthcheck natif (utilise Actuator)
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
