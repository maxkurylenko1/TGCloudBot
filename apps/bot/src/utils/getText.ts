import type { Message } from 'telegraf/typings/core/types/typegram';
import type { Context } from 'telegraf';

export function getText(ctx: Context): string | undefined {
  const m = ctx.message;
  if (m && 'text' in m) return (m as Message.TextMessage).text;
  return undefined;
}
