export const authJWT = (req, res) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split('Bearer ')[1];
        if (!token) {
            res.status(401).send({
                ok: false,
                msg: "로그인 수행이 필요합니다."
            });
        }
    }
    ;
};
