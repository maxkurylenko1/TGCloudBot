import { Context } from 'telegraf';
import { CloudflareClient } from '@cf/client';

export interface TelegrafContext extends Context {
  cf: CloudflareClient;
}
