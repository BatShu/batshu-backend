import express from 'express';
import { tokenToUid } from '../auth/auth';

const RoomRouter = express.Router();

RoomRouter.route('/').get(tokenToUid);

export default RoomRouter;
