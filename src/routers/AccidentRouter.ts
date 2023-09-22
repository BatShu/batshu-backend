import express from "express";
import { postAccident } from "../controller/AccidentController"

const AccidentRouter = express.Router();

AccidentRouter.route('/').post(postAccident);

export default AccidentRouter;