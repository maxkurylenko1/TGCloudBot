TGCloudBot Monorepo

Monorepo based on Turborepo, pnpm and TypeScript.
Contains Telegram bot, API server and shared packages.

🚀 Getting Started

1. Install dependencies
   pnpm install

2. Build all apps & packages
   pnpm build

3. Run development
   pnpm dev --filter=bot
   pnpm dev --filter=api

📂 Structure
apps/ # Applications (bot, api)
packages/ # Shared packages (types, config, utils)

🛠 Tooling

TypeScript project references

Prettier + EditorConfig (4 spaces)

ESLint for linting
