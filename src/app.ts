/* eslint-disable import/first */
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({
  path: path.resolve(__dirname, process.env.NODE_ENV === 'production' ? '../.env.production' : '../.env.development')
});

import type http from 'http';
import express, { type Request, type Response, type Application } from 'express';
import bodyParser from 'body-parser';
import AccidentRouter from './routers/AccidentRouter';
import ObserveRouter from './routers/ObserveRouter';
import UserRouter from './routers/UserRouter';
import MessageRouter from './routers/MessageRouter';
import RoomRouter from './routers/RoomRouter';
import { chatSocket } from './chat/chatSocket';
import cors from 'cors';

const app: Application = express();
// for dev
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true

}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/user', UserRouter);
app.use('/api/accident', AccidentRouter);
app.use('/api/observe', ObserveRouter);
app.use('/api/message', MessageRouter);
app.use('/api/room', RoomRouter);

app.get('/hello', (req: Request, res: Response) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT ?? 3000;

const handleListening = (): void => { console.log(`✅Server listenting on http://localhost:${PORT} 🚀 `); };

const webServer: http.Server = app.listen(PORT, handleListening);

chatSocket(webServer);

export default app;
