import { type Request, type Response } from 'express';
import { } from '../service/RoomService';
import { type ApiResponse } from 'src/domain/response';


export const getMessage = async (req: Request, res: Response): Promise<void> => {
    // 채팅방에 있는 메시지들 조회
    // request params
    // {
    //     roomId: int;
    // }
}