import { Telegraf } from 'telegraf';
import { loadEnv, logger } from '@config/core';
import { CloudflareClient } from '@cf/client';
import { allowedChatGuard } from '@telegram/kit';
// import { TelegramHttpMessenger } from '@telegram/kit/src/messenger';
import { registerDomain } from './commands/registerDomain';
import { dnsAdd } from './commands/dnsAdd';
import { dnsUpdate } from './commands/dnsUpdate';
import { dnsDelete } from './commands/dnsDelete';
import type { TelegrafContext } from './types';
import { findZone } from './commands/findZone';

const env = loadEnv();
const bot = new Telegraf<TelegrafContext>(env.TELEGRAM_BOT_TOKEN!);

// DI: Cloudflare client у контекст
bot.use(async (ctx, next) => {
  ctx.cf = new CloudflareClient(process.env.CF_API_TOKEN!, process.env.CF_ACCOUNT_ID!);
  await next();
});

// Guard за chatId
bot.use(allowedChatGuard(env.BOT_ALLOWED_CHAT_ID!));

bot.start((ctx) => ctx.reply('Бот готовий. Використовуйте /help для списку команд.'));
bot.help((ctx) =>
  ctx.reply(
    '/register_domain <domain>\n/dns_add <domain> <type> <name> <content> [ttl] [proxied]\n/dns_update <domain> <id> field=value ...\n/dns_delete <domain> <id>',
  ),
);

bot.command('register_domain', registerDomain());
bot.command('dns_add', dnsAdd());
bot.command('dns_update', dnsUpdate());
bot.command('dns_delete', dnsDelete());
bot.command('find_zone', findZone());

bot.launch().then(() => logger.info('Bot launched in polling mode'));

// Webhook режим (опційно; сервиться через apps/api або окремий HTTP-сервер)
export const webhookCallback = bot.webhookCallback('/telegram/webhook');

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
