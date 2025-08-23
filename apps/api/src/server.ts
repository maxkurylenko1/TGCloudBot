import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { loadEnv } from '@config/core/src/env';
import { logger } from '@config/core/src/logger';
import { TelegramHttpMessenger } from '@telegram/kit';

const env = loadEnv();
const app = express();
app.set('trust proxy', 1);
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

const messenger = new TelegramHttpMessenger(process.env.TELEGRAM_BOT_TOKEN!);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.all('/echo', async (req, res) => {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.ip;
  const info = {
    method: req.method,
    path: req.path,
    ip,
    headers: req.headers,
    body: req.body,
  };
  try {
    await messenger.sendMessage(
      env.BOT_ALLOWED_CHAT_ID,
      `HTTP ${info.method} ${info.path}\nIP: ${ip}`,
    );
  } catch (e: any) {
    logger.error({ err: e }, 'Failed to send telegram message');
  }
  res.json(info);
});

// (Опц.) Якщо хочете тримати webhook у цьому ж сервісі, імпортуйте callback з apps/bot (моно-сервіс варіант)
// import { webhookCallback } from '../../bot/src/index';
// app.post(`/telegram/webhook/${process.env.TELEGRAM_WEBHOOK_SECRET}`, webhookCallback);

app.listen(env.API_PORT, () => logger.info(`API listening on :${env.API_PORT}`));
