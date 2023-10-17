import pool from '../config/database';

export const createUser = async (uid: string) => {
  const connection = await pool.getConnection();
  try {
    await connection.execute('INSERT INTO user (uid) VALUES (?)', [uid]);
    connection.release();
  } catch (error) {
    connection.release();
    throw error;
  }
};

export const readUser = async (uid: string) => {
  const connection = await pool.getConnection();
  try {
    const [user] = await connection.execute('SELECT * FROM user WHERE uid = ?', [uid]);
    const userRows = user as any[];
    connection.release();
    return userRows;
  } catch (error) {
    connection.release();
    throw error;
  }
};

export default { createUser, readUser };
