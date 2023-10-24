import { type Request, type Response } from 'express';
import { selectMessage } from '../service/MessageService';
import { type ApiResponse } from 'src/domain/response';


export const getMessages = async (req: Request, res: Response): Promise<void> => {
    // 채팅방에 있는 메시지들 조회
    // request params
    // {
    //     roomId: int;
    // }
    try {
        const roomId: number = parseInt(req.params.roomId,10);
        const resData: ApiResponse = await selectMessage(roomId);

        res.status(200).json(resData);
    } catch(err){
        const resData: ApiResponse = {
            ok: false,
            msg: "INTERNAL SERVER ERROR"
        }
        res.status(500).json(resData);
    }
}