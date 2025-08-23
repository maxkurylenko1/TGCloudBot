import { MiddlewareFn } from 'telegraf';
import type { TelegrafContext } from '../types';
import { Message } from 'telegraf/typings/core/types/typegram';

export const findZone = (): MiddlewareFn<TelegrafContext> => async (ctx: TelegrafContext) => {
  const msg = ctx.message;
  const text = msg && 'text' in msg ? (msg as Message.TextMessage).text : undefined;
  const domain = text?.trim().split(/\s+/)[1];

  if (!domain) return ctx.reply('Використання: /register_domain <domain>');

  try {
    const zone = await ctx.cf.findZoneByName(domain);
    const msg = [
      `Назва: ${zone?.name}`,
      `Статус: ${zone?.status}`,
      `NS: ${zone?.name_servers?.join('\n')}`,
    ].join('\n');
    await ctx.reply(msg);
  } catch (e: any) {
    await ctx.reply(`Помилка створення зони: ${e.message}`);
  }
};
