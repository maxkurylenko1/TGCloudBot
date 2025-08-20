import type { TelegrafContext } from '../types';
import { getText } from '../utils/getText';

export const dnsUpdate = () => async (ctx: TelegrafContext) => {
  const text = getText(ctx);
  const parts = text?.trim().split(/\s+/) ?? [];
  const [, domain, id, ...kv] = parts;
  if (!domain || !id || kv.length === 0)
    return ctx.reply('Використання: /dns_update <domain> <id> field=value ...');
  try {
    const zone = await ctx.cf.findZoneByName(domain);
    if (!zone) return ctx.reply('Зона не знайдена');
    const patch: any = {};
    kv.forEach((p) => {
      const [k, v] = p.split('=');
      if (k) patch[k] = k === 'ttl' ? Number(v) : v === 'true' ? true : v === 'false' ? false : v;
    });
    const rec = await ctx.cf.updateDns(zone.id, id, patch);
    await ctx.reply(`DNS оновлено: ${rec.id} ${rec.type} ${rec.name} -> ${rec.content}`);
  } catch (e: any) {
    await ctx.reply(`Помилка DNS оновлення: ${e.message}`);
  }
};
