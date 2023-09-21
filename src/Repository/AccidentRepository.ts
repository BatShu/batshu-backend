import pool from "../config/database";


interface ResultSetHeader {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  info: string;
  serverStatus: number;
  warningStatus: number;
}

export const createAccident = async (data: any) => { // any 얘 interface 지정해주기
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
          user_id,
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
        data.userId,
        data.bounty
      ]);

      const insertId = (accidentRows as ResultSetHeader[])[0].insertId;

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

export default { createAccident } ;