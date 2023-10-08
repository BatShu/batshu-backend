import { RowDataPacket } from "mysql2";

export interface getAccidentResponse extends RowDataPacket {
  id: number;
  y: number;
  x: number;
  radius: number;
  bounty: number;
  license_plate: string;
  car_model_name: string;
  accident_end_time: Date;
  accident_start_time: Date;
  created_at: Date;
  content_description: string;
  content_title: string;
  picture_url: string;
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  info: string;
  serverStatus: number;
  warningStatus: number;
}