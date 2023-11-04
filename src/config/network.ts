import type { CorsOptions, CorsOptionsDelegate } from 'cors';

export const corsOption: CorsOptions | CorsOptionsDelegate = {
  origin: process.env.CLIENT_BASE_URL ?? 'http://localhost:5173',
  credentials: true
};
