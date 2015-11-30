var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/triviador');

var db = function()
{
	var Schema = mongoose.Schema;
	var jugador = new Schema({
	  email:  String,
	  nombres: String,
	  password:String,
	  fecha: { type: Date, default: Date.now },
	  estado:Boolean,
	  puntaje: {
	    partidas: { type: Number, default: 0 },
	    puntos:  { type: Number, default: 0 }
	  }
	});
	var jugadormodel=mongoose.model('jugador', jugador);
	var pregunta = new Schema({
	  enunciado:String,
	  categoria:String,
	  fecha:{ type: Date, default: Date.now },
	  respuesta:[
		  {
		  	respuesta:String,
		  	correcto:Boolean	
		  }
	  ]
	});
	var preguntamodel=mongoose.model('pregunta', pregunta);

	var juegos = new Schema({
	  nombre:  String,
	  estado:String,
	  cantpreguntas:Number,
	  preguntas:[{
	  	type:Schema.Types.ObjectId,
	  	ref:'pregunta'
	  }],
	  fecha: { type: Date, default: Date.now },
	  usuario:[{type:Schema.Types.ObjectId,ref:'jugador'}]
	});
	var juegosmodel=mongoose.model('juegos', juegos);
	//agregar jugadores
	//metodos
	//Testado
	this.insertjugador=function(data,callback)
	{
		var j=jugadormodel(data);
		j.save(function(err){
			if(err)
			{

			}
			jugadormodel.findById(j,function(err,ju){
				callback(ju);
			});
		});
	}
	this.getAllJugador=function(callback)
	{
		jugadormodel.find(function(err,rows){
			callback(rows);
		});
	}
	this.getJugador=function(id,callback)
	{
		jugadormodel.findById(id,function(err,rows){
			callback(rows);
		});
	}
	this.getPreguntas=function(callback)
	{
		preguntamodel.find(function(err,rows){
			callback(rows);
		});
	}
	this.insertpregunta=function(data,callback)
	{
		var p=preguntamodel(data);
		p.save(function(err){
			preguntamodel.findById(p,function(err,pe){
				callback(pe);
			});
		})
	}
	this.insertjuego=function(data,callback)
	{
		var j=juegosmodel(data);
		j.save(function(err){
			juegosmodel.findById(j,function(err,pe){
				callback(pe);
			});
		});
	}

	return this;

}
module.exports=db;

