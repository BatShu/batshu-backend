import express from 'express';
import { tokenToUid } from '../auth/auth';
import { getMessages } from '../controller/MessageController';

const MessageRouter = express.Router();

MessageRouter.route('/:roomId').get(tokenToUid, getMessages); // 채팅방에 있는 채팅메시지들 가져오기.

export default MessageRouter;
