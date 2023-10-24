import express from 'express';
import { tokenToUid } from '../auth/auth';

const MessageRouter = express.Router();

MessageRouter.route('/').get(tokenToUid);

export default MessageRouter;
