import { DateTime } from "aws-sdk/clients/devicefarm";
import pool from "../config/database";


interface ResultSetHeader {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  info: string;
  serverStatus: number;
  warningStatus: number;
}

interface AccidentRow {
  id: number;
  content_title: string;
  content_description: string;
  accident_start_time: DateTime;
  accident_end_time: DateTime;
  created_at: DateTime;
  accident_location: Location;
  car_model_name: string;
  license_plate: string;
  bounty: number;
  uid: string;
}

export const createAccident = async (data: Accident):Promise<void> => {
    try {
      const connection = await pool.getConnection();
      const accidentInsertQuery:string = `
        INSERT INTO accident (
          content_title,
          content_description,
          accident_start_time,
          accident_end_time,
          created_at,
          accident_location,
          car_model_name,
          license_plate,
          uid,
          bounty
        ) VALUES (?, ?, ?, ?, NOW(), POINT(?, ?), ?, ?, ?, ?)
      `;
      
      const accidentRows = await connection.execute(accidentInsertQuery, [ // insertId 가 accidentId 임.
        data.contentTitle,
        data.contentDescription,
        data.accidentTime[0],
        data.accidentTime[1],
        data.accidentLocation.x,
        data.accidentLocation.y,
        data.carModelName,
        data.licensePlate,
        data.uid,
        data.bounty
      ]);

      const insertId = (accidentRows as ResultSetHeader[])[0].insertId; // 방금 Insert 한 accident row 에 accidentId 를 외래키로 가져오기 위함.

      const accidentPictureInsertQuery: string = `
        INSERT INTO accident_picture (
          picture_url,
          accident_id
        ) VALUES (?, ?)
      `
      const pictures:string[] = data.pictureUrl;

      for (let picture of pictures){
        await connection.execute(accidentPictureInsertQuery, [
          picture,
          insertId
        ])
      }

      connection.release();
    } catch (error) {
      throw error;
    }
  }


  export const readAccident = async (accidentId:number):Promise<void> => {
    try {
      const connection = await pool.getConnection();

      const accidentSelectQuery:string = `SELECT * FROM accident WHERE id = ?`;

      const accidentRows = await connection.execute(accidentSelectQuery, [ 
        accidentId
      ]);

      console.log(accidentRows[0]);

      const accidentPictureSelectQuery:string = `SELECT * FROM accident_picture WHERE accident_id = ?`;

      const accidentPictureRows = await connection.execute(accidentPictureSelectQuery, [ 
        accidentId
      ]);

      console.log(accidentPictureRows[0]);

      connection.release();
    } catch (error) {
      throw error;
    }
  }



export default { createAccident, readAccident } ;