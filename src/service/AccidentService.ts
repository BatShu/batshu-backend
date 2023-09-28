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
        // 의미적 데이터 처리
        // (accidentRows as ResultSetHeader[])[0].insertId;
        const accidentRow = await AccidentRepository.selectAccidentRow(accidentId) as ResultSetHeader[];

        const accidnetPictureRows = await AccidentRepository.selectAccidentPictureRow(accidentId) as ResultSetHeader[];

            // [1] {
            // [1]   id: 40,
            // [1]   content_title: '아..큰일남',
            // [1]   content_description: '뺑소니당했어',
            // [1]   accident_start_time: 2023-11-01T15:05:04.000Z,
            // [1]   accident_end_time: 2023-11-01T15:06:04.000Z,
            // [1]   created_at: 2023-09-27T05:19:19.000Z,
            // [1]   accident_location: { x: 32.234234234, y: 152.234234234 },
            // [1]   car_model_name: 'avante',
            // [1]   license_plate: '13어 1342',
            // [1]   bounty: 400000,
            // [1]   uid: 'FXnyJZ3ql6S2hiZFDnMhcQrFR5g2'
            // [1] }
            // [1] {
            // [1]   id: 33,
            // [1]   picture_url: 'https://batshu-bucket.s3.amazonaws.com/08660e5e05139af79f08d4635e7f9a38.png',
            // [1]   accident_id: 40
            // [1] }
        
        const accidentLocation:LocationObject = {
            x : "",
            y : ""
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

        console.log(accidentRow[0]);
        console.log(accidnetPictureRows[0]);
        
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