import express from 'express';
import { tokenToUid } from '../auth/auth';
import { getRoom, getRooms, postRoom } from '../controller/RoomController';

const RoomRouter = express.Router();

RoomRouter.route('/').get(tokenToUid, getRooms); // 채팅방들 목록 가져오기.
RoomRouter.route('/:roomId').get(tokenToUid, getRoom); // 채팅방 정보 가져오기.
RoomRouter.route('/').post(tokenToUid, postRoom); // 채팅방 생성.

export default RoomRouter;
