import { type RowDataPacket } from 'mysql2';

export interface LocationRow extends RowDataPacket {
  id: number
  x: number
  y: number
}

export interface UserRow extends RowDataPacket {
  id: number
  uid: string
}
