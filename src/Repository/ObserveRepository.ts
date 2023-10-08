import pool from "../config/database";

export const selectObserveOnTheMapRow = async (locationObject:LocationObject) => {
    try{
      const connection = await pool.getConnection();
  
      const observeSelectQuery: string = `
        SELECT id, ST_X(observe_location) AS x, ST_Y(observe_location) AS y
        FROM observe
        WHERE ST_Distance_Sphere(
          observe_location,
          ST_GeomFromText('POINT(${locationObject.x} ${locationObject.y})')
        ) <= ?;`;
      
      const observeRows = await connection.execute(observeSelectQuery, [
        locationObject.radius
      ])
  
      connection.release();
      return observeRows[0];
    } catch (err) {
      return err;
    }
  }
  
  
  export default { selectObserveOnTheMapRow } ;