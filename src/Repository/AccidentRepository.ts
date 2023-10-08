import { FieldPacket } from "mysql2";
import pool from "../config/database";
import { AccidentRow, AccidentPictureRow } from "../interface/accident";
import { LocationRow } from "../interface/both";

export const selectAccidentRow = async (accidentId:number):Promise<AccidentRow> => {
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

  const [accidentRows]: [AccidentRow[], FieldPacket[]] = await connection.execute<AccidentRow[]>(accidentSelectQuery, [ 
    accidentId
  ]);

  console.log(accidentRows)
  connection.release();

  return accidentRows[0];
}

export const selectAccidentPictureRow = async (accidentId:number): Promise<AccidentPictureRow[]> => {
  const connection = await pool.getConnection();

  const accidentPictureSelectQuery:string = `SELECT accident_id ,picture_url FROM accident_picture WHERE accident_id = ?`;

  const [accidentPictureRows]:[AccidentPictureRow[], FieldPacket[]] = await connection.execute<AccidentPictureRow[]>(accidentPictureSelectQuery, [ 
    accidentId
  ]);
  connection.release();
  console.log(accidentPictureRows)
  return accidentPictureRows;
}

export const insertAccidentRow = async (data:Accident) => {
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
    
    const accidentRows = await connection.execute(accidentInsertQuery, [
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

export const selectAccidentOnTheMapRow = async (locationObject:LocationObject):Promise<LocationRow[]> => {
    const connection = await pool.getConnection();

    const accidentSelectQuery: string = `
      SELECT id, ST_X(accident_location) AS x, ST_Y(accident_location) AS y
      FROM accident
      WHERE ST_Distance_Sphere(
        accident_location,
        ST_GeomFromText('POINT(${locationObject.x} ${locationObject.y})')
      ) <= ?;`;
    
    const [accidentRows]:[LocationRow[], FieldPacket[]]  = await connection.execute<LocationRow[]>(accidentSelectQuery, [
      locationObject.radius
    ])

    console.log(accidentRows)

    connection.release();
    return accidentRows;
}


export default { insertAccidentRow, insertAccidentPictureRow, selectAccidentRow, selectAccidentPictureRow, selectAccidentOnTheMapRow } ;