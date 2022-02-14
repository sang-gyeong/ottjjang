const { User } = require('../models/User')

let auth = (req, res, next) => {
    //인증 처리를 하는 곳

    // 클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;

    // 토큰을 decode한 후, 유저를 찾는다.
    // 이를 위해 새로운 메소드를 만들자 (User.js에서)
    User.findByToken(token, (err, user) => {
        if (err) throw err;

        if (!user) return res.json({ isAuth: false, error: true })

        // 유저가 있으면 인증 Okay
        req.token = token;
        req.user = user;
        next() //미들웨어이기 때문에 다음으로 넘어갈 수 있게. next가 없으면 미들웨어에 갖히므로
    })

}


module.exports = { auth };