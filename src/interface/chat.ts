import { type RowDataPacket } from 'mysql2';

export interface SendMessageRequest {
  socketId: string
  roomId: number
  sendUserUid: string
  message: string
}

export interface PostRoomRequest {
  reportUid: string
  isAccident: boolean
  id: number
}

export interface InsertRoomRowParams {
  uid: string
  reportUid: string
  accidentId?: number | null
  observeId?: number | null
}

export interface SelectMessageRow extends RowDataPacket {
  uid: string
  message: string
  createdAt: Date
}

export interface Chat {
  sendUserUid: string
  message: string
  createdAt: Date
}

export interface SelectRoomRow extends RowDataPacket {
  uid: string
  report_uid: string
  accidentId: number | null
  observeId: number | null
}

export interface ReadChatData {
  isAccident: boolean
  id: number
  chatList: Chat[]
}

export interface ReadRoom {
  // userInfo
  displayName: string
  googleProfilePhotoUrl: string
  // accidentOrObserveInfo
  placeName: string
  // message
  lastChat: string
  lastChatCreatedAt: Date
}

export interface ReadRoomData {
  // room
  roomId: number
  // userInfo
  displayName?: string
  googleProfilePhotoUrl?: string
  // accidentOrObserveInfo
  placeName: string
  // message
  lastChat: string
  lastChatCreatedAt: string
}

export interface ReadRoomDataForList {
  roomId: number
  uid: string
  isAccident?: boolean
  id?: number
  lastChat: string
  lastChatCreatedAt: string
}

export interface selectRoomListRow extends RowDataPacket {
  id: number
  uid: string
  report_uid: string
  observe_id: number
  accident_id: number
}

export interface selectNecessaryRow {
  roomId: number
  uid: string
  accidentId?: number
  observeId?: number
}
