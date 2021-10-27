const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

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

app.delete('/delete', function(req, res) {
    console.log(req.body);
    req.body._id = parseInt(req.body._id);
    db.collection('post').deleteOne(req.body, function(err, result){
        console.log('삭제완료');
        res.status(200).send({ message: '성공했습니다'});
    })
})

app.get('/detail/:id', function(req, res) {
    db.collection('post').findOne({_id : parseInt(req.params.id)}, function(err, result) {
        console.log(result);
        res.render('detail.ejs', {data : result});
    })
    
})

app.get('/edit/:id', function(req, res) {

    db.collection('post').findOne({_id: parseInt(req.params.id)}, function(err, result) {
        console.log(result);
        res.render('edit.ejs', {post : result});
    })
});

app.put('/edit', function(req, res) {
    db.collection('post').updateOne({_id : parseInt(req.body.id) }, {$set: {제목: req.body.title, 날짜: req.body.date}},
     function(err, result) {
        console.log('수정완료');
        res.redirect('/list');
    })
});

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(session({secret: 'secret', resave: true, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/login', function(req, res) {
    res.render('login.ejs')
});
app.post('/login', passport.authenticate('local', {
    failureRedirect : '/fail'
}), function(req, res) {
    res.redirect('/')
});

passport.use(new LocalStrategy({
    usernameField: 'id',
    passwordField: 'pw',
    session: true,
    passReqToCallback: false,
  }, function (입력한아이디, 입력한비번, done) {
    //console.log(입력한아이디, 입력한비번);
    db.collection('login').findOne({ id: 입력한아이디 }, function (에러, 결과) {
      if (에러) return done(에러)
  
      if (!결과) return done(null, false, { message: '존재하지않는 아이디요' })
      if (입력한비번 == 결과.pw) {
        return done(null, 결과)
      } else {
        return done(null, false, { message: '비번틀렸어요' })
      }
    })
  }));