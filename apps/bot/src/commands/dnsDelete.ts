import type { TelegrafContext } from '../types';
import { getText } from '../utils/getText';

export const dnsDelete = () => async (ctx: TelegrafContext) => {
  const text = getText(ctx);
  const parts = text?.trim().split(/\s+/) ?? [];
  // /dns_delete <domain> <id>
  const [, domain, id] = parts;
  if (!domain || !id) return ctx.reply('Використання: /dns_delete <domain> <id>');
  try {
    const zone = await ctx.cf.findZoneByName(domain);
    if (!zone) return ctx.reply('Зона не знайдена');
    await ctx.cf.deleteDns(zone.id, id);
    await ctx.reply(`DNS видалено: ${id}`);
  } catch (e: any) {
    await ctx.reply(`Помилка DNS видалення: ${e.message}`);
  }
};
