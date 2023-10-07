import express from "express";
import multer from "multer";
import { getObserve, mosaicProcessing, registerObserve, uploadVideo } from "../controller/ObserveController"
import { tokenToUid } from "../auth/auth";
import { localStorage, fileFilter } from "../utils/aws-s3";

const ObserverRouter = express.Router();


const observeVideoUpload = multer({ storage: localStorage, fileFilter: fileFilter });


ObserverRouter.route('/video').post(tokenToUid, observeVideoUpload.single("video"), uploadVideo,mosaicProcessing);

ObserverRouter.route('/register').post(tokenToUid, registerObserve);

ObserverRouter.route('/:observeId').get(tokenToUid,getObserve);

export default ObserverRouter