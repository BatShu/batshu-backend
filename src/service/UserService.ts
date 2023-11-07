import { type ApiResponse } from 'src/domain/response';
import userRepository, { updateUserAccount } from '../Repository/UserRepository';
import { type UserAccountUpdate } from '../interface/both';
import pool from '../config/database';
import { type PoolConnection } from 'mysql2/promise';

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
    throw error;
  }
};

export async function removeUser (uid: string): Promise<ApiResponse> {
  try {
    const existingUser = await userRepository.readUser(uid);
    if (existingUser.length === 0) {
      const resData: ApiResponse = {
        ok: false,
        msg: '삭제할 유저가 존재하지 않습니다.'
      };

      return resData;
    }

    await userRepository.removeUser(uid);

    const resData: ApiResponse = {
      ok: true,
      msg: '성공적으로 유저를 삭제했습니다.'
    };
    return resData;
  } catch (error) {
    console.error('에러 발생:', error);
    throw error;
  }
}

export const userInfoAddAccount = async (passedData: UserAccountUpdate): Promise<ApiResponse> => {
  try {
    const existingUser = await userRepository.readUser(passedData.uid);
    if (existingUser.length === 0) {
      const resData: ApiResponse = {
        ok: false,
        msg: '계좌 정보를 업데이트할 유저가 존재하지 않습니다.'
      };

      return resData;
    }
    const connection: PoolConnection = await pool.getConnection();

    await updateUserAccount(connection, passedData);

    connection.release();

    const resData: ApiResponse = {
      ok: true,
      msg: '성공적으로 유저 계좌 정보를 업데이트했습니다.'
    };
    return resData;
  } catch (error) {
    console.error('에러 발생:', error);
    throw error;
  }
};
