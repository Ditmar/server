var express = require('express');

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var mongoose = require('mongoose');
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
//construimos el socket
var io = require('socket.io')(http);
io.on('connection',function(socket){
  socket.emit('server',{server:'Conexión establecida'});
  socket.on('onLog',function(params){
    query.auth(params,function(obj){
      if(obj.length==1){
        socket.USER=obj[0];
        socket.emit('onLog',{status:true,msn:"Autenticado Correctamente"});
      }else{
        socket.emit('onLog',{status:false,msn:"Error En la Autenticación"});
      }
    })
    socket.USER=params.user;
  });
  //conexion a un juego especifico
  socket.on('crear_partida',function(partida){
    //console.log(partida);
    query.insertjuego(partida,function(r){
      //console.log(r);
      var datapartida=r;
      query.getPreguntas(function(rows){
        var verificarrepetidas=function(item)
        {
          for(var i=0;i<rep.length;i++)
          {
            if(rep[i]==item)
            {
              return false;
            }
          }
          return true;
        }
        rep=[];
        while(rep.length!=3)
        {
        
          var i=Math.round(Math.random()*(rows.length-1)) 
          if(verificarrepetidas(i))
          {
            rep.push(i);
            r.preguntas.push(rows[i]);
          }
        }
        r.save(function(err){
          if(err)
          {
            console.log("Error");
          }else
          {
            query.getJuego(r,function(juego){
              //comunicamos un juego creado
              console.log('---------> '+juego[0]._id);

              socket.join(juego[0]._id);
              socket.emit('crear_partida',juego);
              io.to('salaprincipal').emit('crear_partida',juego);
            });
          }
        });

      });

    })
  });
  socket.on('sala_principal',function(){
    socket.join('salaprincipal');
    io.to('salaprincipal').emit('sala_join',{msn:'Se ha Unido A la sala '+socket.USER.nombres});
  });
  socket.on('unirse_juego',function(clientmsn){
    socket.join(clientmsn.salita);
    var id=clientmsn.salita;
    query.getJuego({_id:mongoose.Types.ObjectId(id)},function(juego){
      //console.log(juego.usuario);
      juego[0].usuario.push(socket.USER);
      juego[0].save(function(err){
        if(err){
          console.log('Error');
        }else{
          io.to(clientmsn.salita).emit('unirse_juego',{msn:socket.USER.nombres+' Se ha unido al juego'});
        }
      });
    });
  });
  socket.on('dejar_sala',function(clientmsn){
    
    query.getJuego({_id:clientmsn.sala},function(juego){
      for(var i=0;i<juego.usuario.length;i++)
      {
        if(juego.usuario._id=socket.USER._id)
        {
          juego.usuario.splite(i,1);
        }
      }
      juego.save(function(err){
        if(err){
          console.log('Error')
        }else{
          io.to(clientmsn.sala).emit('dejar_sala',{msn:socket.USER.nombres+'  dejado el juego'});
          socket.leave(clientmsn.sala);
        }
      });
    });
  });

  socket.on('listo_para_jugar',function(clientmsn){
    io.to(clientmsn.sala).emit({id:clientmsn._id,nombres:clientmsn.nombres,ready:true});
  });
});

module.exports = app;
