import express, {Express, Request, Response } from "express";

import { authToken }  from '../auth/auth';
import { confirmAndFetchUserInfo } from "../auth/auth";

const UserRouter = express.Router();

UserRouter.route('/check').get(confirmAndFetchUserInfo);

export default UserRouter;