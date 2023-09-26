import express from "express";
import { getObserve } from "../controller/ObserveController"
import { tokenToUid } from "../auth/auth";

const ObserverRouter = express.Router();

ObserverRouter.route('/:observeId').get(tokenToUid,getObserve);

export default ObserverRouter;