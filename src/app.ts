require("dotenv").config();
import express, {Express, Request, Response } from "express";
import bodyParser from 'body-parser';
import AccidentRouter from "./routers/AccidentRouter.js";
import ObserveRouter from "./routers/ObserveRouter.js";
import UserRouter from "./routers/UserRouter.js";


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());   



app.use("/api/user", UserRouter);
app.use("/api/accident", AccidentRouter);
app.use("/api/observe", ObserveRouter);


const PORT = process.env.PORT || 3000;

const handleListening = () =>
  console.log(`✅Server listenting on http://localhost:${PORT} 🚀 `);

app.listen(PORT, handleListening);


export default app;