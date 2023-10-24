import { type RowDataPacket } from 'mysql2';

export interface SendMessageRequest {
    roodId: string
    sendUserUid: string
    message: string
}

export interface SendMessageResponse {
    roodId: string
    sendUserUid: string
    message: string
}

export interface PostRoomRequest {
    uid: string
    reportUid: string
    accidentOrObserve: boolean
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
    accidentOrObserve: boolean
    id: number;
    chatList: Chat[];
}