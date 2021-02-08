const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.set('views','./views');//views폴더가 있어야한다. 
app.set('view engine','jade');//views폴더 안에 jade 확장자에 대해 설정하였다.

app.get('/', (req, res) => {
    res.send('Hello World! 안녕하세요!');
});

app.get('/1',(req,res)=>{
    res.render("index");
})

app.listen(PORT, () => {
    console.log(`${PORT}번 포트로 열림`);
});