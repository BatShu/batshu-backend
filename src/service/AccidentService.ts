const accountRepository = require("../Repository/AccidentRepository");

exports.createAccident = async (data:any[]) => {
    try{
        // 의미적 데이터 처리
        
        await accountRepository.createAccident(data);

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