import express from "express";
import { postAccident, getAccident, getAccidentOnTheMap } from "../controller/AccidentController"
import { tokenToUid } from "../auth/auth";

import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({storage: storage});

const AccidentRouter = express.Router();

AccidentRouter.route('/').get(tokenToUid,getAccidentOnTheMap);
AccidentRouter.route('/').post(tokenToUid,upload.array('pictureUrl'),postAccident);
AccidentRouter.route('/:accidentId').get(tokenToUid,getAccident);

export default AccidentRouter;