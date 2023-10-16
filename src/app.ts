/* eslint-disable import/first */
import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({
  path: path.resolve(__dirname, process.env.NODE_ENV === 'production' ? '../.env.production' : '../.env.development')
});
import express, { Express, type Request, type Response } from 'express';
import bodyParser from 'body-parser';
import AccidentRouter from './routers/AccidentRouter';
import ObserveRouter from './routers/ObserveRouter';
import UserRouter from './routers/UserRouter';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/user', UserRouter);
app.use('/api/accident', AccidentRouter);
app.use('/api/observe', ObserveRouter);

app.get('/hello', (req: Request, res: Response) => {
  res.send('Hello World!');
});

const PORT = process.env.PORT ?? 3000;

const handleListening = () => { console.log(`✅Server listenting on http://localhost:${PORT} 🚀 `); };

app.listen(PORT, handleListening);

export default app;
