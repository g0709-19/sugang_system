const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Hello World! 안녕하세요!');
});

app.listen(PORT, () => {
    console.log(`${PORT}번 포트로 열림`);
});