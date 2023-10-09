import AccidentRepository from "../Repository/AccidentRepository";

exports.createAccident = async (data:Accident) => {
    try{
        // 의미적 데이터 처리

        const accidentRows = await AccidentRepository.insertAccidentRow(data);
        console.log(accidentRows);
        const insertId = (accidentRows as unknown as ResultSetHeader[])[0].insertId;

        for (let photo of data.photoUrls){
            await AccidentRepository.insertAccidentPhotoRow({
                photoUrl : photo,
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

        const accidentPhotoRows = await AccidentRepository.selectAccidentPhotoRow(accidentId);
        
        const accidentLocation:LocationObject = {
            x : accidentRow.x,
            y : accidentRow.y
        }
        
        const data:Accident = {

            contentTitle: accidentRow.content_title,
            contentDescription: accidentRow.content_description,
            photoUrls: [],
            accidentTime: [
                accidentRow.accident_start_time,
                accidentRow.accident_end_time
            ],
            createdAt: accidentRow.created_at,
            accidentLocation: accidentLocation,
            placeName: accidentRow.placeName,
            carModelName: accidentRow.car_model_name,
            licensePlate: accidentRow.license_plate,
            bounty: accidentRow.bounty
        }

        for (let accidentPhotoRow of accidentPhotoRows){
            data.photoUrls.push(accidentPhotoRow.photo_url);
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