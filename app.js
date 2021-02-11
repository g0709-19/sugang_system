const express = require('express');
const { nextTick } = require('process');
const path = require('path');
const app = express();
const PORT = 3000;
const session = require('express-session');//세션모듈연결

app.use(session({
    secret :'asdjha!@#@#$dd',
    resave:false,
    saveUninitialized:true
    }))
    
    

let bodyParser = require("body-parser");
let msg = require ('dialog')//경고창 띄워주는 모듈

let db = require('./mysql-db');

db.connect();

const sugang = require('./sugang-api');

app.use(express.static('public'));
app.set('views','./views');//views폴더가 있어야한다. 
app.set('view engine','jade');//views폴더 안에 jade 확장자에 대해 설정하였다.
app.use(bodyParser.urlencoded({extended:false}));//bodyparser설정

app.get('/', (req, res) => {
    // 로그인 페이지 연결
    res.sendFile(path.join(__dirname, 'public/html/login.html'),{user_Id : req.session.Id}, (err) => {//세션값추가
        if (err) {
            res.status(500).send('Internal server error!');
            console.log(err);
        }
    })
});
//로그아웃
app.get('/logout',(req,res)=>{
    delete req.session.Id;//세션삭제
    return req.session.save(()=>{res.redirect('/');})
})

//로그인
app.post('/login',(req,res)=>{
    
    db.query('SELECT * FROM user where id=? and password=?',[req.body.Id,req.body.Password],(err,result)=>{

        
        if (err){
            res.status(500).send('Internal server error!');
            console.log(error);
        }
        console.log(result);
        if(result.length>0)//로그인완료되면
        {
            req.session.Id=req.body.Id;//세션값 저장
            return req.session.save(()=>{res.render("index",{userInfo:`${result[0].name}(${req.session.Id})`});})
            

        }
        else//실패하면 로그인화면으로
        {
            msg.info ("로그인에 실패하였습니다!");  
            res.redirect("/");
        }

    })

    
    
});

app.get('/api/get/class', (req, res) => {
    const major = req.query.major;
    const univ = req.query.univ;
    const Major = req.query.Major;
    let user = req.query.user;//세션으로 받기 유저아이디
    
    if (major) // localhost:3000/api/get/class?major={학과ID}
        sugang.getClassFromMajor(res, major);
    else if (univ) // localhost:3000/api/get/class?univ={대학ID}
        sugang.getClassFromUniv(res, univ);
    else if (user) // localhost:3000/api/get/class?user={학번}
    {
        user= req.session.Id;   
        return req.session.save(()=>{sugang.lookup(res, user);}) 
    }
    else if (Major)// localhost:3000/api/get/class?Major={대학ID}
        sugang.getMajorFromUniv(res,Major);
    else
        sugang.getAllClass(res);
});

// 수강 신청
// localhost:3000/api/enroll/{과목ID}
app.get('/api/enroll/:id', (req, res) => {
    /*
        로그인 시 req.session.user 에 유저 정보 저장해뒀다가
        req.session.user.id 같은 형태로 학번 가져와야됨
    */
    let user_id = req.session.Id;
    const id = req.params.id;
    if (id) {
        sugang.enroll(user_id, id, result => {
            if (result) {
                // res.send('성공!');
                // 자바스크립트 fetch 로 응답을 받고
                // enrolled 값이 true 라면 제대로 신청된 것으로 인식하여 처리
                res.json({enrolled:true});
            } else {
                // res.send('실패!');
                res.json({});
            }
        });
    }
})

// 수강 신청 취소
// localhost:3000/api/delist/{과목ID}
app.get('/api/delist/:id', (req, res) => {
    /*
        로그인 시 req.session.user 에 유저 정보 저장해뒀다가
        req.session.user.id 같은 형태로 학번 가져와야됨
    */
    let user_id = req.session.Id;
    const id = req.params.id;
    if (id) {
        sugang.delist(user_id, id, result => {
            if (result) {
                // res.send('성공!');
                // 자바스크립트 fetch 로 응답을 받고
                // enrolled 값이 true 라면 제대로 신청된 것으로 인식하여 처리
                res.json({enrolled:true});
            } else {
                // res.send('실패!');
                res.json({});
            }
        });
    }
})

// 버튼을 눌렀을 때 click 이벤트로 /accept/15 신호 보내게
// 화면 출력 함수 실행 (api 가져다 쓰는거)

app.listen(PORT, () => {
    console.log(`${PORT}번 포트로 열림`);
});