import express from "express";
import { postAccident } from "../controller/AccidentController"
import { tokenToUid } from "../auth/auth";

const AccidentRouter = express.Router();

AccidentRouter.route('/').post(tokenToUid,postAccident);

export default AccidentRouter;