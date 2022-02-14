const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const config = require('./config/key')
const cookieParser = require('cookie-parser')
const { User } = require('./models/User')
const { auth } = require('./middleware/auth')

//*bodyparser 옵션 설정*
//application/x-www-form-urlencoded이걸 분석해줌
app.use(bodyParser.urlencoded({ extended: true }))
    //application/json을 분석해줌
app.use(bodyParser.json())
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(() => console.log('MongoDB Connected!')) //연결이 잘 됐는지 확인
    .catch(err => console.log(err))

app.get('/', (req, res) => res.send('Hello World! 아아아 치과가기 귀차나'))

app.get('/api/hello', (req,res)=>{
    res.send('룰루랄라 루비랄라')
})


app.post('/api/users/register', (req, res) => {
    //회원 가입할때 필요한 정보들을 client에서 가져오면
    //그것들을 데이터베이스에 넣어준다.

    //유저모델 인스턴스 생성
    const user = new User(req.body);
    console.log(user)
        //req.body안에는 json형식으로 id, password등이 들어있음.
        //이는 앞의 bodyParser덕분
    user.save((err, userInfo) => {
        if (err) return res.json({ success: false, err }) //성공하지 못하면 제이슨형식으로 알려줌
        return res.status(200).json({ //성공시
            success: true
        })
    })
})


app.post('/api/users/login', (req, res) => {
    //요청된 email가 데이터베이스에 있는지 찾는다. 
    User.findOne({ email: req.body.email }, (err, user) => {

        if (!user) { //없는경우
            return res.json({
                loginSuccess: false,
                message: '제공된 이메일에 해당하는 유저가 없습니다.'
            })
        }
        //요청된 email이 있다면, 비밀번호가 맞는 비밀번호인지 확인.
        //아래에서 만든 메소드를 사용한다
        user.comparePassword(req.body.password, (err, isMatch) => {
            //비밀번호가 같지 않는경우
            if (!isMatch) {
                return res.json({ loginSuccess: false, message: '비밀번호가 틀렸습니다.' })
            }
            //비밀번호까지 맞다면 토큰을 생성하기.
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err); //클라이언트에게 에러 전달

                // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지 등등 가능
                // 어디에 저장하는게 안전한지는 논란이 많음. 우리는 일단 쿠키에 저장하자.
                // 쿠키에 저장하기 위해서는 라이브러리를 설치해야한다. bodyParser처럼 express에서 제공하는 cookieParser

                //이렇게 해주면 x_auth라는 이름에 토큰이 들어감. x_auth말고 다른이름도 가능
                res.cookie("x_auth", user.token)
                    .status(200)
                    .json({ loginSuccess: true, userId: user._id })


            })
        })
    })
})

//role 0 : 일반유저, role 1이거나 0이 아니면 관리자
app.get('/api/users/auth', auth, (req, res) => {
    //여기까지 미들웨어를 통과해 왔다는 애기는 Authentication이 True 라는 말.

    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true, //내 정책에 따라 설정하자(role1이 어드민, 2가 ... 이런건 내가 직접 설정하자. 여기선 0이면 일반유저, 0이아니면 어드민)
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})


app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "" } //토큰 지워주기
        , (err, user) => {
            if (err) return res.json({ success: false, err });
            return res.status(200).send({
                success: true
            })
        })
})







app.listen(port, () => console.log(`Example app listening on part ${port}!`))