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
        const accidentRow = await AccidentRepository.selectAccidentRow(accidentId) as ResultSetHeader[];

        const accidnetPictureRows = await AccidentRepository.selectAccidentPictureRow(accidentId) as ResultSetHeader[];

        const accidentLocation:LocationObject = {
            x : accidentRow[0].x,
            y : accidentRow[0].y
        }

        const data:Accident = {
            contentTitle: accidentRow[0].content_title,
            contentDescription: accidentRow[0].content_description,
            pictureUrl: [],
            accidentTime: [
                accidentRow[0].accident_start_time,
                accidentRow[0].accident_end_time
            ],
            createdAt: accidentRow[0].created_at,
            accidentLocation: accidentLocation,
            carModelName: accidentRow[0].car_model_name,
            licensePlate: accidentRow[0].license_plate,
            bounty: accidentRow[0].bounty
        }

        for (let accidentPictureRow of accidnetPictureRows){
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
    const accidentRows = await AccidentRepository.selectAccidentOnTheMapRow(locationObject) as ResultSetHeader[];
    
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