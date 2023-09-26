import express from "express";
import { postAccident, getAccident } from "../controller/AccidentController"
import { tokenToUid } from "../auth/auth";

import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({storage: storage});

const AccidentRouter = express.Router();

AccidentRouter.route('/').post(tokenToUid,upload.array('pictureUrl'),postAccident);
AccidentRouter.route('/:accidentId').get(tokenToUid,getAccident);

export default AccidentRouter;