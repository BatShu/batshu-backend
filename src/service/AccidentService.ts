import AccidentRepository from "../Repository/AccidentRepository";

exports.createAccident = async (data:Accident) => {
    try{
        // 의미적 데이터 처리

        const accidentRows = await AccidentRepository.insertAccidentRow(data);

        const insertId = (accidentRows as unknown as ResultSetHeader[])[0].insertId;

        for (let picture of data.pictureUrl){
            await AccidentRepository.insertAccidentPictureRow({
                pictureUrl : picture,
                accidentId : insertId
            })
        }

        const resData:ApiResponse = {
            ok: true,
            msg: "Successfully Post"
        }
        return resData;
        
    } catch (error) {
        const resData: ApiResponse = {
            ok: false,
            msg: "INTERNAL SERVER ERROR"
        }
        return resData;
    }
}

exports.readAccident =async (accidentId:number) => {
    try{
        // as a ResultSetHeader[] 제거
        const accidentRow = await AccidentRepository.selectAccidentRow(accidentId);

        const accidentPictureRows = await AccidentRepository.selectAccidentPictureRow(accidentId);
        
        const accidentLocation:LocationObject = {
            x : accidentRow.x,
            y : accidentRow.y
        }
        
        const data:Accident = {

            contentTitle: accidentRow.content_title,
            contentDescription: accidentRow.content_description,
            pictureUrl: [],
            accidentTime: [
                accidentRow.accident_start_time,
                accidentRow.accident_end_time
            ],
            createdAt: accidentRow.created_at,
            accidentLocation: accidentLocation,
            carModelName: accidentRow.car_model_name,
            licensePlate: accidentRow.license_plate,
            bounty: accidentRow.bounty
        }

        for (let accidentPictureRow of accidentPictureRows){
            data.pictureUrl.push(accidentPictureRow.picture_url);
        }

        
        const resData = {
            ok: true,
            msg: "Successfully Get",
            data: data
        }
        return resData;
        
    } catch (error) {
        const resData: ApiResponse = {
            ok: false,
            msg: "INTERNAL SERVER ERROR"
        }
        return resData;
    }
}

exports.readAccidentOnTheMap = async (locationObject:LocationObject) => {
    try{
    const accidentRows = await AccidentRepository.selectAccidentOnTheMapRow(locationObject);
    
    const data:AccidentLocationObject[] = []
    
    for (let accidentRow of accidentRows){
        const location:LocationObject = {
            x : accidentRow.x,
            y : accidentRow.y
        }
        const accidentLocationObject:AccidentLocationObject = {
            accidentId: accidentRow.id,
            accidentLocation: location
        };
        data.push(accidentLocationObject);
    }

    const resData = {
        ok: true,
        msg: "Successfully Get",
        data: data
    } 
    return resData;

    }  catch (error) {
        const resData: ApiResponse = {
            ok: false,
            msg: "INTERNAL SERVER ERROR"
        }
        return resData;
    }
}