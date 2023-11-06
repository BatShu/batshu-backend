import pool from '../config/database';
import { UserAccountUpdate, type UserRow } from '../interface/both';
import { type FieldPacket, type PoolConnection } from 'mysql2/promise';

export const createUser = async (uid: string): Promise<void> => {
  const connection = await pool.getConnection();
  await connection.execute('INSERT INTO user (uid) VALUES (?)', [uid]);
  connection.release();
};

export const readUser = async (uid: string): Promise<UserRow[]> => {
  const connection = await pool.getConnection();
  const [user]: [UserRow[], FieldPacket[]] = await connection.execute('SELECT * FROM user WHERE uid = ?', [uid]);
  console.log(user)
  connection.release();
  return user;
};

export const removeUser = async (uid: string): Promise<void> => {
  const connect = await pool.getConnection();
  const userDeleteQuery: string = 'DELETE FROM user WHERE uid = ?';

  await connect.execute<UserRow[]>(userDeleteQuery, [uid]);
};

export const updateUserAccount = async (connection: PoolConnection, passedData: UserAccountUpdate): Promise<void> => {
  const userUpdateQuery: string = 'UPDATE user SET real_name = ? ,bank_name = ? ,account_number = ? WHERE uid = ?;'

  await connection.execute<UserRow[]>(userUpdateQuery, [passedData.realName, passedData.backName, passedData.accountNumber, passedData.uid]);
}

export default { createUser, readUser, removeUser };
