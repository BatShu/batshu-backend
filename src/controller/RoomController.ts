import { type Request, type Response } from 'express';
import { type ApiResponse } from 'src/domain/response';
import { type PostRoomRequest } from '../interface/chat';
import { insertRoom, selectRoom } from '../service/RoomService';

export const getRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const uid: string = req.params.uid;
    const resData: ApiResponse = await selectRoom(uid);

    res.status(200).send(resData);
  } catch (err) {
    const resData: ApiResponse = {
      ok: false,
      msg: 'INTERNAL SERVER ERROR'
    };
    res.status(500).send(resData);
  }
};

export const postRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const roomObject: PostRoomRequest = {
      uid: req.body.uid,
      reportUid: req.body.reportUid,
      accidentOrObserve: req.body.accidentOrObserve,
      id: req.body.id
    };

    const resData: ApiResponse = await insertRoom(roomObject);

    res.status(200).send(resData);
  } catch (err) {
    const resData: ApiResponse = {
      ok: false,
      msg: 'INTERNAL SERVER ERROR'
    };
    res.status(500).send(resData);
  }
};
