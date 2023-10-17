import pool from '../config/database';
import { UserRow } from 'src/interface/both';
import { type FieldPacket } from 'mysql2';

export const createUser = async (uid: string) => {
  try {
    const connection = await pool.getConnection();

    await connection.execute('INSERT INTO user (uid) VALUES (?)', [uid]);

    connection.release();
  } catch (error) {
    throw error;
  }
};

export const readUser = async (uid: string): Promise<UserRow[]> => {
  try {
    const connection = await pool.getConnection();

    const [user]: [UserRow[], FieldPacket[]] = await connection.execute('SELECT * FROM user WHERE uid = ?', [uid]);

    connection.release();
    return user;
  } catch (error) {
    throw error;
  }
};

export const removeUser = async (uid: string): Promise<void> => {
  try {
    const connect = await pool.getConnection();

    const userDeleteQuery: string = 
    `
    DELETE FROM user
    WHERE uid = ?
    `;

    await connect.execute<UserRow[]>(userDeleteQuery, [
      uid
    ]);
  } catch (error) {
    throw error;
  }
}

export default { createUser, readUser, removeUser };
