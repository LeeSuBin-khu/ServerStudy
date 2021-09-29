const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));

const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');

var db;
MongoClient.connect('mongodb+srv://asdf1234:asdf1234@cluster0.qfyao.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', function(err, client) {

    if(err) return console.log(err)
    db = client.db('todoapp');

    db.collection('post').insertOne({이름: 'ㅁㄴㅇㄹ', 나이: 12},function(err, result) {
        console.log('저장완료');
    });

    app.listen(8080, function() {
        console.log('listening on 8080');
    });

})

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/beauty', function(req, res) {
    res.send("뷰티뷰티뷰티풀");
});

app.get('/write', function(req, res) {
    res.sendFile(__dirname + '/write.html');
});

app.post('/add', function(req, res) {
    res.send('전송완료');
    db.collection('post').insertOne({제목: req.body.title, 날짜: req.body.date}, function(err, result) {
        console.log('저장완료');
    });
});

app.get('/list', function(req, res) {
    req.prependListener('list.ejs');
});