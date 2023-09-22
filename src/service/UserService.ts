const userRepository = require("../Repository/UserRepository");

exports.createUser = async function (uid:string) {
    try{
        const existingUser = await userRepository.readUser(uid);
        
        if (existingUser.length > 0) {
            const resData: ApiResponse = {
                ok: false,
                msg: "already exist"
            }

            return resData;
        }
        
        userRepository.createUser(uid);
        const resData: ApiResponse = {
            ok: true,
            msg: "Success Register!"
        }

        return resData;
    } catch (error) {
        console.error('에러 발생:', error);
    }
}
