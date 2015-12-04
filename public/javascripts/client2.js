jQuery(document).ready(function($) {
	 var socket = io('http://localhost:3000');
  socket.on('server',function(obj){
  	console.log(obj);
  	//socket.emit('crear_partida',{nombre:'prueba',estado:'nuevo',cantpreguntas:10});
  	socket.emit('onLog',{email:'lobo_expiatorio@gmail.com',password:'369512'});
    
  });
	
	socket.on('onLog',function(r){
    console.log(r);
		socket.emit('sala_principal',{});
	});
  socket.on('sala_join',function(r){
    console.log(r);
  });
  socket.on('crear_partida',function(r){
  	 console.log(r);
     console.log(r.length);
     if(r.length>0)
     {
      socket.emit('unirse_juego',{salita:r[0]._id});
     }
     
  });
  socket.on('unirse_juego',function(r){
    console.log(r);

  });
  /*socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });*/
});