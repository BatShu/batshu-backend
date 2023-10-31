import express from 'express';
import { postUser, deleteUser, getUser } from '../controller/UserController';
import { confirmAndFetchUserInfo, tokenToUid } from '../auth/auth';

const UserRouter = express.Router();

UserRouter.route('/check').get(tokenToUid, confirmAndFetchUserInfo);
UserRouter.route('/:uid').get(tokenToUid, getUser);
UserRouter.route('/').post(tokenToUid, postUser);
UserRouter.route('/:uid').delete(tokenToUid, deleteUser);

export default UserRouter;
