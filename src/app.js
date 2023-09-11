import express from "express";
import bodyParser from 'body-parser';
import AccidentRouter from "../src/routers/AccidentRouter.js";
import ObserveRouter from "../src/routers/AccidentRouter.js";
import UserRouter from "../src/routers/UserRouter.js";

const app = express();



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.use("/auth/google", UserRouter);
app.use("/api/accident", AccidentRouter);
app.use("/api/observe", ObserveRouter);




const PORT = process.env.PORT || 3000;

const handleListening = () =>
  console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);


export default app;