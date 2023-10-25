import express from 'express';
import { tokenToUid } from '../auth/auth';
import { getRooms, postRoom } from '../controller/RoomController';

const RoomRouter = express.Router();

RoomRouter.route('/:uid').get(tokenToUid, getRooms); // 채팅방들 목록 가져오기.
RoomRouter.route('/').post(tokenToUid, postRoom); // 채팅방 생성.

export default RoomRouter;
