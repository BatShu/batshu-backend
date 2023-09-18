import pool from "../config/database";
import mysql from 'mysql2/promise';

exports.createUser = async function (uid:string) {
    try{
        const [existingUserRows] = await pool.execute('SELECT * FROM user WHERE uid = ?', [uid]);
        const existingUser = existingUserRows as any[];
        if (existingUser.length) {
            const resData: UserApiResponse = {
                ok: false,
                msg: "already exist"
            }
            return resData;
        }
        
        await pool.execute('INSERT INTO user (uid) VALUES (?)', [uid]);
        const resData: UserApiResponse = {
            ok: true,
            msg: "Success Register"
        }
        return resData;
    } catch (error) {
        console.error('에러 발생:', error);
    }
}
