const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');



const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //빈칸 제거
        unique: 1 //중복 없음
    },
    password: {
        type: String,
        minlength: 5
    },
    role: { //일반유저, 관리자 유저
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: { //토큰 유효기간
        type: Number
    }
})

userSchema.pre('save', function(next) {
    var user = this; //userSchema를 가르키는 것.

    //다른게 아니라 비밀번호를 바꿀때에만 암호화를 시키도록 하기위해 user.isModified
    if (user.isModified('password')) {
        //비밀번호를 암호화 시킨다
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) return next(err); //에러가 나면 바로 user.save로 에러 보냄

            //user.password = plainPassword
            //hash는 암호화된 비밀번호
            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);
                //암호화된 비밀번호 생성에 성공하면 플레인 패스워드를 hash로 교체.
                user.password = hash;
                next() //user.save로 넘어감
            })
        })
    } else {
        next()
    }
})


//comparePassword 메소드 생성
userSchema.methods.comparePassword = function(plainPassword, callback) {
    //plainPassword 1234567
    //암호화를 한 뒤에 데이터베이스에 있는 암호화된 비밀번호와 같은지 비교해야함
    //때문에 bcrypt를 사용할 것
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if (err) return callback(err);
        //에러가 없는경우. isMatch = true.
        callback(null, isMatch);

    })
}

userSchema.methods.generateToken = function(callback) {
    var user = this;
    console.log(user);

    //jsonwebtoken을 이용해서 token을 생성하기
    //user id를 넣어줘서 생성할 것. (database의 id부분임)
    //뒤엔 아무거나 넣어주면 됨. 
    //나중에 토큰을 해석하면 userId가 나옴. 즉 이 토큰을 가지고 이사람이 누군지 알 수 있는 것
    var token = jwt.sign(user._id.toHexString(), 'gyeongToken')

    //이제 이 만든 토큰을 userSchema의 token필드에 넣어주자.
    user.token = token;
    user.save(function(err, user) {
        if (err) return callback(err);
        callback(null, user);
    })
}


userSchema.statics.findByToken = function(token, callback) {
    var user = this;

    //토큰을 decode한다.
    // 이때, 토큰을 만들때 썼던 단어를 넣어주자
    jwt.verify(token, 'gyeongToken', function(err, decoded) {
        console.log("decoded : ", decoded)
            //유저 아이디를 이용해서 유저를 찾은 다음에
            // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
        user.findOne({ "_id": decoded, "token": token }, function(err, user) {
            if (err) return callback(err);
            callback(null, user);
        })
    })
}





//스키마를 이용해서 모델 생성
const User = mongoose.model('User', userSchema);

module.exports = { User };