# TGCloudBot

Telegram-бот + API для керування Cloudflare DNS у монорепозиторії (Node + TypeScript + Turborepo + pnpm).

## 📌 Огляд

- **Bot (Telegraf)**: інтеграція з Cloudflare API
  - додавання / оновлення / видалення DNS-записів / реєстрація доменів
  - доступ лише з конкретного чату (`ALLOWED_CHAT_ID`)
- **API (Express)**
  - `/health` — перевірка стану
  - `/echo` — повертає метод + шлях + IP; бот відправляє це в чат
  - (заплановано) API для керування користувачами
- **Адмінка (заплановано)**
  - React + MUI/Ant Design
  - авторизація, додавання користувачів
- **База даних (заплановано)**
  - MongoDB (AllowedUser модель)

---

## 🗂 Структура репо

```
apps/
  api/        # Express API
  bot/        # Telegram Bot
packages/
  ...         # спільні пакети (utils, types, config)
.github/
  workflows/  # CI/CD пайплайни
.env.example  # приклад змінних середовища
```

---

## 🚀 Швидкий старт (локально)

### 1. Встановити залежності

```bash
pnpm install
```

### 2. Налаштувати `.env`

Скопіюй `.env.example` → `.env` у корені проекту, заповни:

#### .env

```env
NODE_ENV=development
TG_BOT_TOKEN=xxxxxxxx:yyyyyyyyyyyyyyyyyyyy
ALLOWED_CHAT_ID=123456789
CF_API_TOKEN=cf_xxxxxxxxxxxxx
CF_ZONE_ID=your_zone_id
PORT=3000
```

### 3. Запустити у dev-режимі

```bash
pnpm build:packages
pnpm dev --filter=api
pnpm dev --filter=bot
```

### 4. Перевірка

- API: [http://localhost:3000/health](http://localhost:3000/health)
- Бот: напиши команду в Telegram, напр. `/dns_add ...`

---

## 🐳 Запуск у Docker

Команди:

```bash
docker compose build
docker compose up -d
```

---

## ⚙️ CI/CD

### CI

- Лінт, typecheck, build.
- Кешування pnpm.

### CD (заплановано)

- GitHub Actions збирає два Docker-образи (`api`, `bot`) → пушить у **GHCR**.
- По SSH деплоїть на сервер із `docker compose pull && up -d`.
- (альтернатива) Watchtower на сервері для автооновлення.

---

## 🔐 Секрети (заплановано)

### GitHub Secrets (для CD)

- `SSH_HOST`, `SSH_PORT`, `SSH_USER`, `SSH_KEY`
- `GHCR_USER`, `GHCR_TOKEN` (PAT з `write:packages`)

### .env (на сервері / локально)

- `TG_BOT_TOKEN`, `ALLOWED_CHAT_ID`
- `CF_API_TOKEN`, `CF_ZONE_ID`

---

## 📅 Roadmap (по ТЗ)

- [x] Монорепо (Turborepo + pnpm + TS)
- [x] Бот з інтеграцією Cloudflare API
- [x] DNS записи (create/update/delete)
- [x] `/regdomain` + вивід NS
- [x] API → надсилання IP у чат (для `/echo`)
- [ ] MongoDB (AllowedUser)
- [ ] Admin UI (React + MUI/Ant)
- [ ] API `/users` для керування користувачами
- [~] CI/CD з тестами на PR + деплой у прод
- [ ] Покрити проєкт тестами (юнiт та інтеграцiйнi)
