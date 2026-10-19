# 📋 TaskFlow — Gestionnaire de tâches Kanban

Application fullstack de gestion de tâches (type Trello/Jira) construite avec **Spring Boot 3.3.5**, **React 19 / TypeScript** et **PostgreSQL 17**, entièrement dockerisée.

## ✨ Fonctionnalités

- ✅ Création, modification, suppression de tâches
- 🗂️ Tableau Kanban 4 colonnes (À faire, En cours, En revue, Terminé)
- 🖱️ Drag & Drop fluide entre colonnes (optimistic UI)
- 🌓 Mode clair / sombre persistant
- 🏷️ Priorités colorées (Basse, Moyenne, Haute)
- 📧 Notification email à chaque création (capturée par Mailpit en dev)
- 🐳 Stack 100% Dockerisée (multi-stage builds)
- 🔄 Migrations de base versionnées (Flyway)

## 🏗️ Architecture

```text
┌─────────────┐      ┌──────────────┐      ┌──────────────┐
│  Frontend   │─────▶│   Backend    │─────▶│  PostgreSQL  │
│ React+Nginx │      │ Spring Boot  │      │      17      │
│   :3000     │      │    :8080     │      │    :5432     │
└─────────────┘      └──────┬───────┘      └──────────────┘
                            │
                     ┌──────▼───────┐
                     │   Mailpit    │
                     │  (SMTP dev)  │
                     │ :1025 :8025  │
                     └──────────────┘

```
🛠️ Stack technique
Couche	Technologie
Frontend	React 19, TypeScript, Vite, Nginx
Backend	Spring Boot 3.3.5, Java 21, Maven
Base de données	PostgreSQL 17, Flyway
Email (dev)	Mailpit
Conteneurisation	Docker, Docker Compose
🚀 Démarrage rapide
Prérequis

    Docker ≥ 20

    Docker Compose ≥ 2

Lancement
bash

git clone <repo-url>
cd taskflow
docker compose up -d --build

Accès
URL	Service
http://localhost:3000	Application
http://localhost:8081/api/tasks	API REST
http://localhost:8081/actuator/health	Health check
http://localhost:8026	Mailpit (emails de test)
localhost:5433	PostgreSQL
Configuration

Les ports et identifiants sont configurables dans le fichier .env à la racine.
📁 Structure du projet
text
```
taskflow/
├── docker-compose.yml
├── .env
├── backend/          # Spring Boot (Maven, multi-stage)
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
└── frontend/         # React + Vite (multi-stage → Nginx)
    ├── Dockerfile
    ├── nginx.conf
    └── src/
```
📸 Aperçu

(Ajoute ici une capture d'écran de ton app en mode clair et sombre)
🧪 Commandes utiles
bash

# Logs en temps réel
docker compose logs -f

# Rebuild après modif
docker compose up -d --build frontend
docker compose up -d --build backend

# Backup de la base
docker compose exec postgres pg_dump -U taskflow -d taskflow > backup.sql

# Reset complet (⚠️ perte de données)
docker compose down -v && docker compose up -d --build

👤 Auteur

Assondji Malaika — Développeur Fullstack (Java / Spring Boot / React / Python)
text


Sauvegarde.

## 7.3. Créer le dépôt sur GitHub

1. Va sur **https://github.com/new**
2. Nom : `taskflow`
3. **Ne coche rien** (pas de README, pas de .gitignore, pas de licence)
4. Clique sur **Create repository**
5. Copie l'URL du dépôt (ex : `https://github.com/ton-username/taskflow.git`)

## 7.4. Ajouter et committer

```bash
cd ~/taskflow
git add .
git status   # 👀 Vérifie qu'il n'y a pas node_modules/ ni target/ dans la liste
git commit -m "feat: initial commit — TaskFlow fullstack Kanban app"