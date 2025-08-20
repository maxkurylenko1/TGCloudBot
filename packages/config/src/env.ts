import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PUBLIC_URL: z.string().url().optional(),

  TELEGRAM_BOT_TOKEN: z.string().min(10),
  BOT_ALLOWED_CHAT_ID: z
    .string()
    .transform((v) => BigInt(v))
    .or(z.bigint()),
  TELEGRAM_WEBHOOK_SECRET: z.string().optional(),
  BOT_MODE: z.enum(['polling', 'webhook']).default('polling'),

  CF_API_TOKEN: z.string().min(10),
  CF_ACCOUNT_ID: z.string().min(5),

  API_PORT: z.coerce.number().default(8080),
});

export type Env = z.infer<typeof EnvSchema>;

export function loadEnv(raw: NodeJS.ProcessEnv = process.env): Env {
  const parsed = EnvSchema.safeParse(raw);
  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
    process.exit(1);
  }
  return parsed.data;
}
