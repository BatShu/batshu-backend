import express from "express";
import { postUser } from '../controller/UserController'
import { confirmAndFetchUserInfo, getUserInfo }  from '../auth/auth';

const UserRouter = express.Router();



UserRouter.route('/check').get(confirmAndFetchUserInfo);
UserRouter.route('/').get(getUserInfo);
UserRouter.route('/register').post(postUser);

export default UserRouter;