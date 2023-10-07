import { FieldPacket, RowDataPacket } from "mysql2";
import pool from "../config/database";
import { getAccidentResponse } from "../interface/accident";

export const selectAccidentRow =async (accidentId:number) => {
  const connection = await pool.getConnection();

  const accidentSelectQuery:string = 
    `select 
    content_title, 
    content_description, 
    accident_start_time, 
    accident_end_time, 
    created_at, 
    ST_X(accident_location) AS x, 
    ST_Y(accident_location) AS y, 
    car_model_name, 
    license_plate, 
    bounty, 
    uid 
    from accident
    WHERE id = ?`;

  const [accidentRows]: [getAccidentResponse[], FieldPacket[]] = await connection.execute<getAccidentResponse[]>(accidentSelectQuery, [ 
    accidentId
  ]);
  connection.release();

  return accidentRows[0];
}

export const selectAccidentPictureRow =async (accidentId:number) => {
  const connection = await pool.getConnection();

  const accidentPictureSelectQuery:string = `SELECT * FROM accident_picture WHERE accident_id = ?`;

  const accidentPictureRows = await connection.execute(accidentPictureSelectQuery, [ 
    accidentId
  ]);
  connection.release();
  return accidentPictureRows[0];
}

export const insertAccidentRow = async (data:Accident)=> {
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
    connection.release();
    return accidentRows
}

export const insertAccidentPictureRow = async (data:AccidentPicture):Promise<void> => {
    const connection = await pool.getConnection();
    const accidentPictureInsertQuery: string = `
        INSERT INTO accident_picture (
          picture_url,
          accident_id
        ) VALUES (?, ?)
      `
    await connection.execute(accidentPictureInsertQuery, [
      data.pictureUrl,
      data.accidentId
    ])
    connection.release();
}

export const selectAccidentOnTheMapRow = async (locationObject:LocationObject) => {
  try{
    const connection = await pool.getConnection();

    const accidentSelectQuery: string = `
      SELECT id, ST_X(accident_location) AS x, ST_Y(accident_location) AS y
      FROM accident
      WHERE ST_Distance_Sphere(
        accident_location,
        ST_GeomFromText('POINT(${locationObject.x} ${locationObject.y})')
      ) <= ?;`;
    
    const accidentRows = await connection.execute(accidentSelectQuery, [
      locationObject.radius
    ])

    connection.release();
    return accidentRows[0];
  } catch (err) {
    return err;
  }
}


export default { insertAccidentRow, insertAccidentPictureRow, selectAccidentRow, selectAccidentPictureRow, selectAccidentOnTheMapRow } ;