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

export interface insertRoomRowParams {
    uid: string
    reportUid: string
    accidentId?: number | null
    observeId?: number | null
}