var express = require('express');
var app =require('../app');
var router = express.Router();
var model=require('../model/database');
var query=model();
/* GET home page. */
console.log(app)
//SERVICIOS jugador
router.db=query;
router.get('/jugador', function(req, res, next) {
	
	var params=req.query;
	if(params.q=="all")
	{
		query.getAllJugador(function(rows){
			res.send(rows);
		});	
		return;
	}
	if(params.q!="")
	{
		query.getJugador(params.q,function(rows){
			res.send(rows);
		});
		return;
	}
	
});
router.post('/jugador', function(req, res, next) {
	console.log(req.body);
	query.insertjugador(req.body,function(r){
		res.send({id:r,status:'ok'});
	});
});

router.post('/pregunta',function(req, res){
	query.insertpregunta(req.body,function(r){
		res.send({id:r,status:'ok'});
	});
});

router.post('/juego',function(){
	query.insertjuego(req.body,function(r){
		res.send({id:r,status:'ok'});
	});
});

//estadisticas



module.exports = router;
