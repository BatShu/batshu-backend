import express from "express";
import multer from "multer";

import { getObserveInfoByObserveId, videoProcessing, registerObserve, uploadVideo, getObserveOnTheMap } from "../controller/ObserveController"
import { tokenToUid } from "../auth/auth";
import { localStorage, fileFilter } from "../utils/aws-s3";

const ObserverRouter = express.Router();

const observeVideoUpload = multer({ storage: localStorage, fileFilter: fileFilter });


ObserverRouter.route('/video').post(tokenToUid, observeVideoUpload.single("video"), uploadVideo, videoProcessing);
ObserverRouter.route('/register').post(tokenToUid, registerObserve);
ObserverRouter.route('/').get(tokenToUid, getObserveOnTheMap);
ObserverRouter.route('/:observeId').get(tokenToUid, getObserveInfoByObserveId);

export default ObserverRouter