import userRepository from '../Repository/UserRepository';

export async function createUser (uid: string): Promise<ApiResponse>{
  try {
    const existingUser = await userRepository.readUser(uid);

    if (existingUser.length > 0) {
      const resData: ApiResponse = {
        ok: false,
        msg: 'already exist'
      };

      return resData;
    }

    await userRepository.createUser(uid);
    const resData: ApiResponse = {
      ok: true,
      msg: 'Success Register!'
    };

    return resData;
  } catch (error) {
    console.error('에러 발생:', error);
    throw error;
  }
};

export async function removeUser (uid: string): Promise<ApiResponse> {
  try {
    const existingUser = await userRepository.readUser(uid);
    
    if (existingUser.length == 0) {
      const resData: ApiResponse = {
        ok: false,
        msg: '삭제할 유저가 존재하지 않습니다.'
      };

      return resData;
    }

    await userRepository.removeUser(uid);

    const resData: ApiResponse = {
      ok: true,
      msg: '성공적으로 유저를 삭제했습니다.'
    };
    return resData;
    

  } catch (error) {
    console.error('에러 발생:', error);
    throw error;
  }
}