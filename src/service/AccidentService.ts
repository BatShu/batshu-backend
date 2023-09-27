import AccidentRepository from "../Repository/AccidentRepository";

exports.createAccident = async (data:Accident) => {
    try{
        // 의미적 데이터 처리

        const accidentRows = await AccidentRepository.insertAccidentRow(data);

        const insertId = (accidentRows as ResultSetHeader[])[0].insertId;

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
        // 의미적 데이터 처리

        const accidentRow = await AccidentRepository.selectAccidentRow(accidentId);

        const accidnetPictureRow = await AccidentRepository.selectAccidentPictureRow(accidentId);

        console.log(accidentRow);

        console.log(accidnetPictureRow);

        const resData:ApiResponse = {
            ok: true,
            msg: "Successfully Get"
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