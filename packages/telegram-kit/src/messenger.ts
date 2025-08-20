import axios from 'axios';

export interface Messenger {
  sendMessage(
    chatId: bigint | number | string,
    text: string,
    opts?: { parse_mode?: 'MarkdownV2' | 'HTML' },
  ): Promise<void>;
}

export class TelegramHttpMessenger implements Messenger {
  constructor(private token: string) {}
  async sendMessage(
    chatId: bigint | number | string,
    text: string,
    opts?: { parse_mode?: 'MarkdownV2' | 'HTML' },
  ) {
    await axios.post(`https://api.telegram.org/bot${this.token}/sendMessage`, {
      chat_id: chatId.toString(),
      text,
      ...opts,
    });
  }
}
