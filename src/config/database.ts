import dotenv from "dotenv";
dotenv.config();
import mysql, { Pool } from 'mysql2/promise';

const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;


const pool:Pool = mysql.createPool({
    connectionLimit: 10,
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME
});


export default pool;

