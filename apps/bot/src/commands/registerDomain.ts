import { MiddlewareFn } from 'telegraf';
import type { TelegrafContext } from '../types';
import { Message } from 'telegraf/typings/core/types/typegram';

export const registerDomain = (): MiddlewareFn<TelegrafContext> => async (ctx: TelegrafContext) => {
  const msg = ctx.message;
  const text = msg && 'text' in msg ? (msg as Message.TextMessage).text : undefined;
  const domain = text?.trim().split(/\s+/)[1];

  if (!domain) return ctx.reply('Використання: /register_domain <domain>');

  try {
    const z = await ctx.cf.createZone(domain);
    const msg = [
      `Домен: ${z.name}`,
      `Статус: ${z.status}`,
      z.name_servers?.length
        ? `NS:\n- ${z.name_servers.join('\n- ')}`
        : 'NS буде доступний після створення',
    ].join('\n');
    await ctx.reply(msg);
  } catch (e: any) {
    await ctx.reply(`Помилка створення зони: ${e.message}`);
  }
};
