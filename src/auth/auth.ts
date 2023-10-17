import { type NextFunction, type Request, type Response } from 'express';
import { admin } from './firebase';
import { type ApiResponse } from 'src/domain/response';

declare global {
  namespace Express {
    interface Request {
      currentUser: string
      userEmail: string | undefined
    }
  }
  interface UserInfo {
    uid: string
    email: string
    displayName: string
    googleProfilePhotoUrl: string
  }

  export interface CustomRequest extends Request {
    uid?: string // 'uid' 프로퍼티를 추가합니다.
  }
}

export const tokenToUid = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  if (req.headers.authorization) {
    const token: string | undefined = req.headers.authorization.split('Bearer ')[1];

    if (token !== undefined) { // Handle nullish case explicitly
      try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.uid = decodedToken.uid;
        next();
      } catch (error) {
        // Handle token verification error here
        res.status(401).send('Unauthorized1');
      }
    } else {
      // Handle case where the token is missing or empty string
      res.status(401).send('Unauthorized2');
    }
  } else {
    // Handle case where authorization header is missing
    res.status(401).send('Unauthorized3');
  }
};

// 유저 uid 인식.
export const confirmAndFetchUserInfo = async (req: CustomRequest, res: Response) => {
  let uid: string;

  if (req.headers.uid === undefined) {
    if (typeof req.headers.uid === 'string') {
      uid = req.headers.uid;

      req.currentUser = uid;
      req.userEmail = uid;
    } else {
      return res.status(401).send({
        ok: false,
        msg: 'UID값이 존재하지 않습니다.'
      });
    }
  }
};

export const getUserInfo = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (typeof req.uid === 'string') {
      // UID를 사용하여 사용자 정보 가져오기
      const uid: string = req.params.uid;
      const userInfo = await admin.auth().getUser(uid);

      if (userInfo === undefined) {
        const resData: ApiResponse = {
          ok: false,
          msg: '등록되지 않은 유저입니다.'
        };

        res.status(400).json(resData);
      } else {
        const resData: ApiResponse = {
          ok: true,
          msg: 'Successfully Get UserInfo',
          data: {
            uid: uid,
            email: userInfo.email ?? '', // Use nullish coalescing operator
            displayName: userInfo.displayName ?? '', // Use nullish coalescing operator
            googleProfilePhotoUrl: userInfo.photoURL ?? '' // Use nullish coalescing operator
          }
        };
        res.status(200).json(resData);
      }
    }
  } catch (error) {
    console.error('Error:', error);
    const resData: ApiResponse = {
      ok: false,
      msg: 'INTERNAL SERVER ERROR'
    };
    res.status(500).json(resData);
  }
};

export default { confirmAndFetchUserInfo, getUserInfo };
