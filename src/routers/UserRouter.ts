import express, {Express, Request, Response } from "express";

import { authToken, userPost }  from '../auth/auth';
import { confirmAndFetchUserInfo } from "../auth/auth";

const UserRouter = express.Router();

UserRouter.route('/check').get(confirmAndFetchUserInfo);
UserRouter.route('/').post(userPost);

export default UserRouter;