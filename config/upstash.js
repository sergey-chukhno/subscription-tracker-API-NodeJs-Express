import { Client as WorkClient } from '@upstash/workflow';
import { QSTASH_TOKEN, QSTASH_URL } from './env.js';

export const client = new WorkClient({
  baseUrl: QSTASH_URL,
  token: QSTASH_TOKEN
});

