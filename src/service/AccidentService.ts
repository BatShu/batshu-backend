import { type ApiResponse } from '../domain/response';
import AccidentRepository from '../Repository/AccidentRepository';
import { admin } from '../auth/firebase';

export const createAccident = async (data: AccidentDto): Promise<ApiResponse> => {
  // 의미적 데이터 처리

  const accidentRows = await AccidentRepository.insertAccidentRow(data);
  const insertId = (accidentRows as unknown as ResultSetHeader).insertId;
  for (const photo of data.photoUrls) {
    await AccidentRepository.insertAccidentPhotoRow({
      photoUrl: photo,
      accidentId: insertId
    });
  }

  const resData: ApiResponse = {
    ok: true,
    msg: 'Successfully Post'
  };
  return resData;
};

export const readAccident = async (accidentId: number): Promise<ApiResponse> => {
  try {
    const accidentRows = await AccidentRepository.selectAccidentRow(accidentId);

    if (accidentRows.length === 0) {
      const resData: ApiResponse = {
        ok: false,
        msg: '해당 사고 아이디가 존재하지 않습니다.'
      };
      return resData;
    }

    const accidentRow = accidentRows[0];

    const accidentPhotoRows = await AccidentRepository.selectAccidentPhotoRow(accidentId);

    const accidentLocation: LocationObject = {
      x: accidentRow.x,
      y: accidentRow.y
    };

    const userInfo: UidUserInfo = await admin.auth().getUser(accidentRow.uid);

    const data: Accident = {
      contentTitle: accidentRow.content_title,
      contentDescription: accidentRow.content_description,
      photoUrls: [],
      accidentTime: [
        accidentRow.accident_start_time,
        accidentRow.accident_end_time
      ],
      createdAt: accidentRow.created_at,
      accidentLocation,
      placeName: accidentRow.placeName,
      carModelName: accidentRow.car_model_name,
      licensePlate: accidentRow.license_plate,
      bounty: accidentRow.bounty,
      displayName: userInfo.displayName,
      googleProfilePhotoUrl: userInfo.photoURL,
      uid: accidentRow.uid,
      id: accidentId
    };

    for (const accidentPhotoRow of accidentPhotoRows) {
      data.photoUrls.push(accidentPhotoRow.photo_url);
    }

    const resData = {
      ok: true,
      msg: 'Successfully Get',
      data
    };
    return resData;
  } catch (error) {
    const resData: ApiResponse = {
      ok: false,
      msg: 'INTERNAL SERVER ERROR'
    };
    return resData;
  }
};

export const readAccidentOnTheMap = async (locationObject: LocationObject): Promise<ApiResponse> => {
  try {
    const accidentRows = await AccidentRepository.selectAccidentOnTheMapRow(locationObject);

    const data: AccidentLocationObject[] = [];

    for (const accidentRow of accidentRows) {
      const location: LocationObject = {
        x: accidentRow.x,
        y: accidentRow.y
      };
      const accidentLocationObject: AccidentLocationObject = {
        accidentId: accidentRow.id,
        accidentLocation: location
      };
      data.push(accidentLocationObject);
    }

    const resData = {
      ok: true,
      msg: 'Successfully Get',
      data
    };
    return resData;
  } catch (error) {
    const resData: ApiResponse = {
      ok: false,
      msg: 'INTERNAL SERVER ERROR'
    };
    return resData;
  }
};
