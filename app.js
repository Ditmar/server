var express = require('express');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
//creacion del servidor
var port=3000;
var http=app.listen(port,function(){
  console.log('Servidor Corriendo en '+port);
})
//var model=require('./model/database');
var query=routes.db;
console.log(query);
//construimos el socket
var io = require('socket.io')(http);
io.on('connection',function(socket){
  socket.emit('server',{server:'Conexión establecida'});
  //conexion a un juego especifico
  socket.on('crear_partida',function(partida){
    query.insertjuego(req.body,function(r){
      
      //se seleccionan las preguntas
      query.getPreguntas(function(rows){
        var len=rows.length-1;
        var semilla=Math.round(Math.random()*(len-2))+2;
        var preguntas=[];
        for(var i=0;i<partida.preguntas*2;i++)
        {
          var semilla=Math.round(Math.random()*len);
          if(semilla%2==0)
          {
            preguntas.push(rows[semilla%len]);
          }
          semilla++;
        }
        query.updatePartida(r,{$preguntas:preguntas},{multi:true},function(err,affected){
          console.log(affected);
        });
      });

      
      //res.send({id:r,status:'ok'});

    })
  });
  socket.on('unirse_juego',function(clientmsn){
    socket.join(clientmsn.sala);
    io.to(clientmsn.sala).emit({msn:clientmsn.nombres+" ha iniciado"});
  });
  socket.on('listo_para_jugar',function(clientmsn){
    io.to(clientmsn.sala).emit({id:clientmsn._id,nombres:clientmsn.nombres,ready:true});
  });
  socket.on('enviar_set_preguntas',function(objpreguntas){
     io.to(clientmsn.sala).emit(objpreguntas);
  });
});

module.exports = app;
