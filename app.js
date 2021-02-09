const express = require('express');
const { nextTick } = require('process');
const path = require('path');
const app = express();
const PORT = 3000;

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
    res.sendFile(path.join(__dirname, 'public/html/login.html'), (err) => {
        if (err) {
            res.status(500).send('Internal server error!');
            console.log(err);
        }
    })
});

app.post('/login',(req,res)=>{
    
    db.query('SELECT * FROM user where id=? and password=?',[req.body.Id,req.body.Password],(err,result)=>{

        if (err){
            res.status(500).send('Internal server error!');
            console.log(error);
        }
        console.log(result);
        if(result.length>0)//로그인완료되면
        {
            res.render("index",{userInfo:`${result[0].name}(${result[0].id})`});
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
    sugang.getClassFromMajor(res, major);
});

app.listen(PORT, () => {
    console.log(`${PORT}번 포트로 열림`);
});