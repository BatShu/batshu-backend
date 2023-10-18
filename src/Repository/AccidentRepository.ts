import { type FieldPacket } from 'mysql2';
import pool from '../config/database';
import { type AccidentRow, type AccidentPhotoRow } from '../interface/accident';
import { type LocationRow } from '../interface/both';

export const selectAccidentRow = async (accidentId: number): Promise<AccidentRow[]> => {
  const connection = await pool.getConnection();

  const accidentSelectQuery: string =
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

  connection.release();

  return accidentRows;
};

export const selectAccidentPhotoRow = async (accidentId: number): Promise<AccidentPhotoRow[]> => {
  const connection = await pool.getConnection();

  const accidentPhotoSelectQuery: string = 'SELECT accident_id ,photo_url FROM accident_photo WHERE accident_id = ?';

  const [accidentPhotoRows]: [AccidentPhotoRow[], FieldPacket[]] = await connection.execute<AccidentPhotoRow[]>(accidentPhotoSelectQuery, [
    accidentId
  ]);
  connection.release();

  return accidentPhotoRows;
};

export const insertAccidentRow = async (data: Accident): Promise<ResultSetHeader[]> => {
  const connection = await pool.getConnection();
  const accidentInsertQuery: string = `
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
        bounty,
        place_name
      ) VALUES (?, ?, ?, ?, NOW(), POINT(?, ?), ?, ?, ?, ?, ?)
    `;

  const [accidentRows]: any = await connection.execute(accidentInsertQuery, [
    data.contentTitle,
    data.contentDescription,
    data.accidentTime[0],
    data.accidentTime[1],
    data.accidentLocation.x,
    data.accidentLocation.y,
    data.carModelName,
    data.licensePlate,
    data.uid,
    data.bounty,
    data.placeName
  ]);
  connection.release();
  return accidentRows;
};

export const insertAccidentPhotoRow = async (data: AccidentPhoto): Promise<void> => {
  const connection = await pool.getConnection();
  const accidentPhotoInsertQuery: string = `
        INSERT INTO accident_photo (
          photo_url,
          accident_id
        ) VALUES (?, ?)
      `;
  await connection.execute(accidentPhotoInsertQuery, [
    data.photoUrl,
    data.accidentId
  ]);
  connection.release();
};

export const selectAccidentOnTheMapRow = async (locationObject: LocationObject): Promise<LocationRow[]> => {
  const connection = await pool.getConnection();

  const accidentSelectQuery: string = `
      SELECT id, ST_X(accident_location) AS x, ST_Y(accident_location) AS y
      FROM accident
      WHERE ST_Distance_Sphere(
        accident_location,
        ST_GeomFromText('POINT(${locationObject.x} ${locationObject.y})')
      ) <= ?;`;

  const [accidentRows]: [LocationRow[], FieldPacket[]] = await connection.execute<LocationRow[]>(accidentSelectQuery, [
    locationObject.radius
  ]);

  connection.release();
  return accidentRows;
};

export default { insertAccidentRow, insertAccidentPhotoRow, selectAccidentRow, selectAccidentPhotoRow, selectAccidentOnTheMapRow };
