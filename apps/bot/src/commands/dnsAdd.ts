import type { TelegrafContext } from '../types';
import { getText } from '../utils/getText';

export const dnsAdd = () => async (ctx: TelegrafContext) => {
  const text = getText(ctx);
  const parts = text?.trim().split(/\s+/) ?? [];
  // /dns_add <domain> <type> <name> <content> [ttl] [proxied]
  const [, domain, type, name, content, ttl, proxied] = parts;
  if (!domain || !type || !name || !content) {
    return ctx.reply('Використання: /dns_add <domain> <type> <name> <content> [ttl] [proxied]');
  }
  try {
    const zone = await ctx.cf.findZoneByName(domain);
    if (!zone) return ctx.reply('Зона не знайдена');
    const rec = await ctx.cf.createDns(zone.id, {
      type: type as any,
      name,
      content,
      ttl: ttl ? Number(ttl) : 300,
      proxied: proxied === 'true',
    });
    await ctx.reply(`DNS створено: ${rec.id} ${rec.type} ${rec.name} -> ${rec.content}`);
  } catch (e: any) {
    await ctx.reply(`Помилка DNS створення: ${e.message}`);
  }
};
