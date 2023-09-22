import pool from "../config/database";

export const createUser = async (uid: string) => { // any 얘 interface 지정해주기
    try {
      const connection = await pool.getConnection();

      await connection.execute('INSERT INTO user (uid) VALUES (?)', [uid]);

      connection.release();
    } catch (error) {
      throw error;
    }
  }

export const readUser = async (uid: string) => {
    try {
        const connection = await pool.getConnection();

        const [user] = await connection.execute('SELECT * FROM user WHERE uid = ?', [uid]);
        
        const userRows = user as any[];
        connection.release();
        return userRows;
    }
    catch(error){
        throw error;
    }
}

export default { createUser, readUser } ;