jQuery(document).ready(function($) {
	 var socket = io('http://localhost:3000');
  socket.on('server',function(obj){
  	console.log(obj);
  	//socket.emit('crear_partida',{nombre:'prueba',estado:'nuevo',cantpreguntas:10});
  	socket.emit('onLog',{email:'prueba@gmail.com',password:'3798783'});
  });
	
	socket.on('onLog',function(r){
		console.log(r);
		socket.emit('crear_partida',{nombre:'prueba',estado:'nuevo',cantpreguntas:10});
	});
  socket.on('crear_partida',function(r){
  	console.log('Partida creada');
  });
  socket.on('unirse_juego',function(r){
    console.log(r);
    
  });
  /*socket.on('news', function (data) {
    console.log(data);
    socket.emit('my other event', { my: 'data' });
  });*/
});