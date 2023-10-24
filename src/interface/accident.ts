import { type RowDataPacket } from 'mysql2';

export interface AccidentRow extends RowDataPacket {
  content_title: string
  content_description: string
  accident_start_time: Date
  accident_end_time: Date
  created_at: Date
  x: number
  y: number
  car_model_name: string
  license_plate: string
  bounty: number
  uid: string
  placeName: string
}

export interface AccidentPhotoRow extends RowDataPacket {
  accident_id: number
  photo_url: string
}
