import { type Request, type Response } from 'express';
import { type ApiResponse } from 'src/domain/response';
import { type PostRoomRequest } from '../interface/chat';
import { insertRoom, selectRoom, selectRoomsByUid } from '../service/RoomService';

export const getRooms = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const uid = req.uid;
    if (uid == null) {
      throw new Error('uid is null');
    }
    const resData: ApiResponse = await selectRoomsByUid(uid);

    res.status(200).send(resData);
  } catch (err) {
    const resData: ApiResponse = {
      ok: false,
      msg: 'INTERNAL SERVER ERROR'
    };
    res.status(500).send(resData);
  }
};

export const getRoom = async (req: Request, res: Response): Promise<void> => {
  try {
    const roomId: number = parseInt(req.params.roomId, 10);
    const data = await selectRoom(roomId);

    res.status(200).send({
      ok: true,
      msg: 'Successfully Get',
      data
    });
  } catch (err) {
    const result: ApiResponse = {
      ok: false,
      msg: 'INTERNAL SERVER ERROR'
    };
    res.status(500).send(result);
  }
};

export const postRoom = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const reportUid = req.uid ?? '';
    const roomObject: PostRoomRequest = {
      reportUid,
      isAccident: req.body.isAccident,
      id: req.body.id
    };
    const resData: ApiResponse = await insertRoom(roomObject);
    if (resData.ok){
      res.status(200).send(resData);
    }
    else {
      res.status(500).send(resData);
    }
  } catch (err) {
    const resData: ApiResponse = {
      ok: false,
      msg: 'INTERNAL SERVER ERROR'
    };
    res.status(500).send(resData);
  }
};
