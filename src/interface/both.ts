import { RowDataPacket } from "mysql2";

export interface LocationRow extends RowDataPacket {
    id: number;
    x: number;
    y: number;
}