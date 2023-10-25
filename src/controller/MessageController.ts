import { type Request, type Response } from 'express';
import { selectMessage } from '../service/MessageService';
import { type ApiResponse } from 'src/domain/response';


export const getMessages = async (req: Request, res: Response): Promise<void> => {
    try {
        const roomId: number = parseInt(req.params.roomId,10);
        console.log(roomId);
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