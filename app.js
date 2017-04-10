var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var shortUrl = require('./models/shortUrl');
var index = require('./routes/index');
var app = express();
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', index);
//connect to the database
mongoose.connect('mongodb://mbuckles:adjf1963@ds155820.mlab.com:55820/mbshorturl');

app.get('/new/:urlToShorten(*)', (req,res, next)=>{
  var {urlToShorten} = req.params;
  //regex for url
  var regex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  //var regex = expression;
  if(regex.test(urlToShorten)===true){
    var short = Math.floor(Math.random()*100000).toString();
    var data = new shortUrl(
    {
      originalUrl: urlToShorten,
      shorterUrl: short
    }
  );
//in case dbase is down
  data.save(err => {
    if (err) {
      return res.send('Err saving to datebase');
    }
  });
  return res.json(data)
}
var data = new shortUrl({
  originalUrl: 'urlToShorten does not match standart format',
  shorterUrl: 'InvalidURL'
});
return res.json(data);
});
//query bdase and forward to originalUrl
app.get('/:urlToForward', (req,res,next) =>{
  //stores the values of the param
  var shorterUrl = req.params.urlToForward;
  shortUrl.findOne({'shorterUrl': shorterUrl}, (err, data)=>{
    if(err) return res.send('Error reading database');
    var re = new RegExp("^(http||https)://", "i");
    var strToCheck = data.originalUrl;
    if(re.test(strToCheck)){
      res.redirect(301, data.originalUrl);
    }
    else {
      res.redirect(301, 'http://' + data.originalUrl);
    }
  })
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//create  dbase entry
module.exports = app;
//app.listen(process.env.PORT || 3000);
//app.configure('development', function () { app.locals.pretty = true; });
//app.use(express.static(path.join(__dirname +'/public')));
//app.use(logger('dev'));
//app.use(cookieParser());
//app.use('/users', users);
// connect to datebase

// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
}); */
//console.log('working');
