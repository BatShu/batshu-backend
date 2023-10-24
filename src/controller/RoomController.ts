import { type Request, type Response } from 'express';
import { insertRoom, selectRoom } from '../service/RoomService';
import { type ApiResponse } from 'src/domain/response';
import { PostRoomRequest } from '../interface/chat';


export const getRooms = async (req: Request, res: Response): Promise<void> => {
    // request params
    // {
    //     uid: string;
    // }
    try {
        const uid: string = req.params.uid;
        const resData: ApiResponse = await selectRoom(uid);

        res.status(200).send(resData);
    } catch (err){
        const resData: ApiResponse = {
            ok: false,
            msg: "INTERNAL SERVER ERROR"
        }
        res.status(500).send(resData);
    }
}

export const postRoom = async (req: Request, res: Response): Promise<void> => {
    // request body
    // {
    //     uidList: string[];
    //     accidentOrObserve: bool; 
    //     id: number;
    //     // true accident, false observe
    // }
    try {

        const roomObject: PostRoomRequest = {
            uid: req.body.uid,
            reportUid: req.body.report_uid,
            accidentOrObserve: req.body.accidentOrObserve,
            id: req.body.id
        }

        const resData: ApiResponse = await insertRoom(roomObject);

        res.status(200).send(resData);
    } catch (err){
        const resData: ApiResponse = {
            ok: false,
            msg: "INTERNAL SERVER ERROR"
        }
        res.status(500).send(resData);
    }
}