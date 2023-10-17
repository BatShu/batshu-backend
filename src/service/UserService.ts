import { type ApiResponse } from 'src/domain/response';
import userRepository from '../Repository/UserRepository';

export async function createUser (uid: string): Promise<ApiResponse> {
  try {
    const existingUser = await userRepository.readUser(uid);

    if (existingUser.length > 0) {
      const resData: ApiResponse = {
        ok: false,
        msg: 'already exist'
      };

      return resData;
    }

    await userRepository.createUser(uid);
    const resData: ApiResponse = {
      ok: true,
      msg: 'Success Register!'
    };

    return resData;
  } catch (error) {
    console.error('에러 발생:', error);
    return {
      ok: false,
      msg: 'INTERNAL SERVER ERROR'
    };
  }
};
