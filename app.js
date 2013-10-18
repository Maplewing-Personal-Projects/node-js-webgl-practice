/*
 * Module dependencies
 */
var express = require('express')
  , stylus = require('stylus')
  , nib = require('nib')
  , glob = require('glob')
  , fs = require('fs')
  , path = require('path');

var app = express();
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.limit('4mb'));
app.use(express.bodyParser({uploadDir:'./upload'}));
app.use(express.logger('dev'));
app.use(stylus.middleware(
  { src: __dirname + '/public'
  , compile: compile
  }
));
app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.render('index',
  { title : 'Home' }
  );
});

app.get('/lab01', function (req, res) {
  res.render('lab01',
  { title : 'Lab01' }
  );
});

app.get('/lab02', function (req, res) {
  res.render('lab02',
  { title : 'Lab02' }
  );
});

  app.post('/lab02/check', function (req, res){
    if(req.body.code === 'pqowie'){
      res.redirect('/lab02/pass');
    } else {
      res.redirect('/lab02/fail');
    }
  });

  app.get('/lab02/pass', function (req, res){
    res.render('lab02_result',
    { title : 'Lab02: pass',
      result : 'PASS!',
      color : '#474' }
    );
  });

  app.get('/lab02/fail', function (req, res){
    res.render('lab02_result',
    { title : 'Lab02: pass',
      result : 'FAIL!',
      color : '#744' }
    );
  });

app.get('/lab03', function (req, res){
  res.render('lab03',
  { title : 'Lab03' }
  );
});

app.get('/lab04', function (req, res) {
  res.render('lab04',
  { title : 'Lab04',
    n : req.query.n }
  );
});

app.get('/lab05', function (req, res){
  glob("public/image/*.jpg", function(err, files){
    res.render('lab05',
    { title : 'Lab05',
      files : files }
    );
  });
});

app.get('/lab06', function (req, res){
  res.render('lab06',
  { title : 'Lab06' }
  );
});

app.post('/lab06-upload', function (req, res){
  var tmpPath = req.files.fileField.path;
  var targetPath = './public/image/' + req.files.fileField.name;
  if( path.extname(req.files.fileField.name) === '.jpg' ){
    fs.rename(tmpPath, targetPath, function(err){
      if(err) throw err;
      fs.unlink( tmpPath, function(){
        if(err) throw err;
         console.log('File uploaded to: ' + targetPath + ' - ' + req.files.fileField.size + ' bytes');
      });
    })
  }
  else{
    fs.unlink( tmpPath, function(){
      if(err) throw err;
       console.log('File not uploaded to: ' + targetPath);
    });
  }
  res.redirect('/lab05');
});

app.get('/WebGL01', function (req, res) {
  res.render('webgl01',
  { title : 'WebGL01' }
  );
});

app.get('/DS01', function (req, res){
  res.render('DS01',
  { title : 'Data Structor: Homework 1' }
  );
});

app.get('/DS02', function (req, res){
  res.render('DS02',
  { title : 'Data Structor: Homework 2' }
  );
});


var port = process.env.PORT || 5000;
app.listen(port, function(){
  console.log("Listening on " + port);
});