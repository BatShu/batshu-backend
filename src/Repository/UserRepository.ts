import pool from '../config/database';
import { type UserRow } from 'src/interface/both';
import { type FieldPacket } from 'mysql2';

export const createUser = async (uid: string) => {
  const connection = await pool.getConnection();
  await connection.execute('INSERT INTO user (uid) VALUES (?)', [uid]);
  connection.release();
};

export const readUser = async (uid: string): Promise<UserRow[]> => {
  const connection = await pool.getConnection();
  const [user]: [UserRow[], FieldPacket[]] = await connection.execute('SELECT * FROM user WHERE uid = ?', [uid]);
  connection.release();
  return user;
};

export const removeUser = async (uid: string): Promise<void> => {
  const connect = await pool.getConnection();
  const userDeleteQuery: string = 'DELETE FROM user WHERE uid = ?';

  await connect.execute<UserRow[]>(userDeleteQuery, [uid]);
};

export default { createUser, readUser, removeUser };
