import express from 'express';
import { tokenToUid } from '../auth/auth';
import { getMessage } from '../controller/MessageController'

const MessageRouter = express.Router();

MessageRouter.route('/').get(tokenToUid,getMessage); // 채팅방에 있는 채팅메시지들 가져오기.

export default MessageRouter;
