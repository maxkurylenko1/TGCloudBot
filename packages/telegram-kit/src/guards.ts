import type { Context, MiddlewareFn } from 'telegraf';

export function allowedChatGuard(allowedChatId: bigint): MiddlewareFn<Context> {
  return async (ctx, next) => {
    const chatId = BigInt(ctx.chat?.id ?? 0);
    if (chatId !== allowedChatId) {
      if (ctx.chat?.type === 'private') {
        await ctx.reply('Доступ заборонено. Зверніться до адміністратора.');
      }
      return; // ігноруємо інші чати
    }
    return next();
  };
}
