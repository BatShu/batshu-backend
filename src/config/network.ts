import type { CorsOptions, CorsOptionsDelegate } from 'cors';

export const corsOption: CorsOptions | CorsOptionsDelegate = {
  origin: ['https://batshu-c203f.firebaseapp.com', 'https://batshu-c203f.web.app', 'http://localhost:5173'],
  credentials: true
};
