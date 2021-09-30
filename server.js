const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));

const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');

var db;
MongoClient.connect('mongodb+srv://asdf1234:asdf1234@cluster0.qfyao.mongodb.net/todoapp?retryWrites=true&w=majority', function(err, client) {

    if(err) return console.log(err)
    db = client.db('todoapp');

    // db.collection('post').insertOne({이름: 'john', 나이: 12},function(err, result) {
    //     console.log('저장완료');
    // });

    app.listen(8080, function() {
        console.log('listening on 8080');
    });

})

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/write', function(req, res) {
    res.sendFile(__dirname + '/write.html');
});

app.post('/add', function(req, res) {
    res.send('전송완료');
    db.collection('counter').findOne({name: '게시물갯수'}, function(err, result) {
        console.log(result.totalPost);
        var totalPostNum = result.totalPost;
        console.log(req.body.title, req.body.date);

        db.collection('post').insertOne({ _id: totalPostNum+1 , 제목: req.body.title, 날짜: req.body.date}, function(err, result) {
        console.log('저장완료');
        db.collection('counter').updateOne({name: '게시물갯수'}, {$inc: {totalPost:1}}, function(err, result) {
            if(err) {return console.log(err)}
        })
    });

    });
});

app.get('/list', function(req, res) {
    db.collection('post').find().toArray(function(err, result){
    res.render('list.ejs', {posts: result});
    });
});