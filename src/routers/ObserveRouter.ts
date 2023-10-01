import express from "express";
import multer from "multer";
import { getObserve, mosaicProcessing, registerObserve } from "../controller/ObserveController"
import { tokenToUid } from "../auth/auth";
import { localStorage } from "../utils/aws-s3";

const ObserverRouter = express.Router();


const observeVideoUpload = multer({storage: localStorage});


// 동영상 업로드
ObserverRouter.route('/video').post(observeVideoUpload.single("video"), mosaicProcessing);
ObserverRouter.route('/register').post(registerObserve);

ObserverRouter.route('/:observeId').get(tokenToUid,getObserve);

export default ObserverRouter;