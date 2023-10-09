import { RowDataPacket } from "mysql2";

export interface LocationObject {
  x : number;
  y : number;
  radius? : number;

}

export interface video {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  path: string;
  filename: string;
  size: number;
}
    
export interface registerObserveRequest {
  contentTitle : string;
  contentDescription : string;
  videoId : number;
  carModelName : string;
  licensePlate : string;
  observeTime : Date[];
  createdAt? : Date;
  accidentLocation : LocationObject;
  uid? : string;
}

export interface reigsterObserveResponse {
  ok : boolean;
  msg : string;
  thumbnailUrl : string;
  createdAt : Date;
  
}
