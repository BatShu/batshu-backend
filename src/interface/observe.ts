import { type RowDataPacket } from 'mysql2';
import { type LocationRow } from './both';

export interface LocationObject {
  x: number
  y: number
  radius?: number

}

export interface video {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  destination: string
  path: string
  filename: string
  size: number
}

export interface registerObserveRequest {
  contentTitle: string
  contentDescription: string
  videoId: number
  carModelName: string
  licensePlate: string
  placeName: string
  observeTime: Date[]
  createdAt?: Date
  observeLocation: LocationObject
  uid?: string
}
export interface RegisterObserveResponse extends RowDataPacket {
  observeId: number
  uid: string
  videoUrl: string
  thumbnailUrl: string
  contentTitle: string
  contentDescription: string
  carModelName: string
  licensePlate: string
  observeStartTime: Date
  observeEndTime: Date
  observeLocation: LocationRow
  createdAt: Date
}

export interface videoInfo extends RowDataPacket {
  id: number
  videoUrl: string
  thumbnailUrl: string
}

export interface observeInformationByVideoIdReponse extends RowDataPacket {
  observeId: number
  vieoUrl: string
  thumbnailUrl: string
  content_title: string
  content_description: string
  accident_start_time: Date
  accident_end_time: Date
  created_at: Date
  x: number
  y: number
  car_model_name: string
  license_plate: string
  uid: string
}

export interface videoId extends RowDataPacket {
  video_id: number
}

export interface ObserveUidPlaceNameRow extends RowDataPacket {
  uid: string
  place_name: string
}
