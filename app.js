const express = require('express');
const { nextTick } = require('process');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.set('views','./views');//views폴더가 있어야한다. 
app.set('view engine','jade');//views폴더 안에 jade 확장자에 대해 설정하였다.

app.get('/', (req, res) => {
    // 로그인 페이지 연결
    res.sendFile(path.join(__dirname, 'public/html/login.html'), (err) => {
        if (err) {
            res.status(500).send('Internal server error!');
            console.log(err);
        }
    })
});

app.get('/1',(req,res)=>{
    res.render("index");
})

app.listen(PORT, () => {
    console.log(`${PORT}번 포트로 열림`);
});