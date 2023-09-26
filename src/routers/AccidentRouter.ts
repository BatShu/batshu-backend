import express from "express";
import { postAccident } from "../controller/AccidentController"
import { tokenToUid } from "../auth/auth";

import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({storage: storage});

const AccidentRouter = express.Router();

AccidentRouter.route('/').post(tokenToUid,upload.array('pictureUrl'),postAccident);

export default AccidentRouter;