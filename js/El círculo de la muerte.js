//Constantes para encontrar la foto de la carta en la baraja
const sx=75;
const sy=60;
const sW=146;
const sH=196;
const posicioncarta=[{"x":0,"y":0},{"x":1,"y":0},{"x":0,"y":1},{"x":1,"y":1},{"x":0,"y":2},{"x":1,"y":2},{"x":0,"y":3},{"x":1,"y":3},{"x":0,"y":4},{"x":1,"y":4},{"x":9,"y":4},{"x":8,"y":5},{"x":9,"y":5},
                  {"x":2,"y":0},{"x":3,"y":0},{"x":2,"y":1},{"x":3,"y":1},{"x":2,"y":2},{"x":3,"y":2},{"x":2,"y":3},{"x":3,"y":3},{"x":2,"y":4},{"x":3,"y":4},{"x":9,"y":1},{"x":8,"y":2},{"x":9,"y":2},
                  {"x":4,"y":0},{"x":5,"y":0},{"x":4,"y":1},{"x":5,"y":1},{"x":4,"y":2},{"x":5,"y":2},{"x":4,"y":3},{"x":5,"y":3},{"x":4,"y":4},{"x":5,"y":4},{"x":8,"y":0},{"x":9,"y":0},{"x":8,"y":1},
                  {"x":6,"y":0},{"x":7,"y":0},{"x":6,"y":1},{"x":7,"y":1},{"x":6,"y":2},{"x":7,"y":2},{"x":6,"y":3},{"x":7,"y":3},{"x":6,"y":4},{"x":7,"y":4},{"x":8,"y":3},{"x":9,"y":3},{"x":8,"y":4}];

//Constantes para la dibujar la carta todo referido al ancho o altura (que deberan ser las mismas)
const margen=0.05;
const margen_y_superior=0.15;
const margen_y_inferior=0.05;
//estos decrementos son los que se aplicaran cuando ya solo queden 3, los intermedios son todos iguales (proporcionales a 49 avances)
const decremento_y_superior=(0.15-0.02)/(0.15*49);
const decremento_y_inferior=(0.05-0.019)/(0.05*49);

//Constantes para el mazo
const numcartasmazo=52;

//Variable global para la imagen de la carta
var imgc;

//Funcion para obtener la posicion del raton
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();                                                //Obtengo coordenadas de mi canvas
  return {"x": evt.clientX - rect.left,                                                             //Obtengo coordenadas de mi evento
    	  "y": evt.clientY - rect.top}                                                               //La resta sera donde esta mi cursor en coordenadas absolutas
}

//Mi funcion usada para la animacion
window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
    function(callback) {
    };
})();

//Mi clase mazo
/*****************************************************************/
function Mazo(numero)
{
	var numcartas = numero;
	var cartas = [];
	var cartasRestantes = function()
	{
		return numcartas-cartas.length;
	}
	var cartasSacadas = function()
	{
		return cartas.length;
	}
	var reiniciar = function()
	{
		cartas=[];
	}
	var sacarCarta = function(){
		var carta;
		if(cartasRestantes()==0)                                                                                
			return false;
		do{
			carta=parseInt(Math.floor(Math.random()*numcartas));                                              
		}while((function(){
			for(var i=0,tamano=cartas.length;i<tamano;i++)                                            //Recorro mis cartas salidas
			{
				if(carta==cartas[i])                                                                    //Si hay una que es igual
			    {
			    	return true;                                                                          //Es cierto que esta repetida
			    }
			}
			return false; 
		})());

		cartas.push(carta);                                                                       
		return carta;
	};

	return {
		numcartas: numcartas,
		cartasRestantes: cartasRestantes,
		cartasSacadas: cartasSacadas,
		reiniciar: reiniciar,
		sacarCarta: sacarCarta
	}
}

//Mi clase puntero
/*****************************************************************/
function Puntero(posicion,inicio,fin)
{
	var migiro = {"angulo":0,"cx":0,"cy":0};
	var mitamano = {"x":0,"y":0};
	var mirecorrido={"inicio":inicio,"fin":fin};
	var miposicion=posicion;
	var sentido=true;

	var setPosicion = function(posicion)
	{
		miposicion=posicion;
	}

	var setInicio = function(inicio)
	{
		mirecorrido["inicio"]=inicio;
		if(mitamano["y"]!=undefined)
		{
			mirecorrido["fin"]={"x":mirecorrido["inicio"]["x"],"y":mirecorrido["inicio"]["y"]+mitamano["y"]};
		}
	}

	var setGiro = function(giro)
	{
		migiro["angulo"]=giro["angulo"];
		migiro["cx"]=giro["cx"];
		migiro["cy"]=giro["cy"];
	}

	var setTamano = function(tambarr)
	{
		if(tambarr["x"]<tambarr["y"])
			tambarr["x"]=tambarr["y"];

		mitamano["x"]=tambarr["x"]*0.05;
		mitamano["y"]=tambarr["y"];

		if(mirecorrido["inicio"]!=undefined)
		{
			mirecorrido["fin"]={"x":mirecorrido["inicio"]["x"],"y":mirecorrido["inicio"]["y"]+tambarr["y"]};	
		}
	}

	var getPosicion = function()
	{
		return miposicion;
	}

	var avanza = function(avance)
	{

		if(sentido)
		{
			miposicion+=avance;
			if(miposicion>100)
			{
				miposicion-=avance*2;
				sentido=false;
			} 
		} else {
			miposicion-=avance;
			if(miposicion<0)
			{
				miposicion+=avance*2;
				sentido=true;
			}
		}
	}

	var dibuja = function(contexto)
	{
		var tamanorecorrido=mirecorrido["fin"]["y"]-mirecorrido["inicio"]["y"];
			contexto.fillStyle = "#FF0000";
			contexto.beginPath();
			contexto.moveTo(mirecorrido["inicio"]["x"],mirecorrido["inicio"]["y"]+(tamanorecorrido*miposicion/100));
			contexto.lineTo(mirecorrido["inicio"]["x"]-mitamano["x"],mirecorrido["inicio"]["y"]+(tamanorecorrido*miposicion/100)-mitamano["x"]/2);
			contexto.lineTo(mirecorrido["inicio"]["x"]-mitamano["x"],mirecorrido["inicio"]["y"]+(tamanorecorrido*miposicion/100)+mitamano["x"]/2);
			contexto.closePath();
	   		contexto.fill();
   		
	}

	return{
		setPosicion: setPosicion,
		setGiro: setGiro,
		setTamano: setTamano,
		setInicio: setInicio,
		getPosicion: getPosicion,
		avanza: avanza,
		dibuja: dibuja
	}
}
//Mi clase barra
/*****************************************************************/
function Barra(posicion_x,posicion_y,dificultad){
	var mipuntero = new Puntero(50,posicion_x,posicion_y);
	var mipos = {"x":posicion_x,"y":posicion_y};
	var migiro = {"angulo":0,"cx":0,"cy":0};
	var mitamano = {"x":0,"y":0};
	var midificultad = dificultad;

	var setPosicion = function(posicion)
	{
		mipos["x"]=posicion["x"];
		mipos["y"]=posicion["y"];
		mipuntero.setInicio(posicion);
	}

	var setGiro = function(giro)
	{
		migiro["angulo"]=giro["angulo"];
		migiro["cx"]=giro["cx"];
		migiro["cy"]=giro["cy"];
		mipuntero.setGiro(giro);
	}

	var setTamano = function(tambarr)
	{
		mitamano["x"]=tambarr["x"];
		mitamano["y"]=tambarr["y"];
		mipuntero.setTamano(tambarr);
	}

	var setDificultad = function(dificultad)
	{
		midificultad=dificultad;
	}

	var getPosicion = function()
	{
		posicion=mipuntero.getPosicion();
		if(posicion>2 && posicion <98)
			return true;
		return false;
	}

	var reiniciar = function()
	{
		mipuntero.setPosicion(50);
	}

	var dibuja = function(contexto,tiempo)
	{
		mipuntero.avanza(tiempo*midificultad/100);

		contexto.save();
		contexto.fillStyle = "#FF0000";
		contexto.fillRect(mipos["x"],mipos["y"],mitamano["x"],mitamano["y"]);
		contexto.fillStyle = "#00FF00";
		contexto.fillRect(mipos["x"],mipos["y"]+mitamano["y"]*0.025,mitamano["x"],mitamano["y"]*0.95);
		contexto.fillStyle = "#0000FF";
		contexto.fillRect(mipos["x"],mipos["y"]+mitamano["y"]*0.1,mitamano["x"],mitamano["y"]*0.8);
		mipuntero.dibuja(contexto);
		contexto.restore();
		
	}

	return{
		setPosicion: setPosicion,
		setGiro: setGiro,
		setTamano: setTamano,
		setDificultad: setDificultad,
		getPosicion: getPosicion,
		dibuja: dibuja
	}
}


//Mi clase carta
/*****************************************************************/
function Carta(posicion_x,posicion_y){
	var mipos = {"x":posicion_x,"y":posicion_y};
	var migiro = {"angulo":0,"cx":0,"cy":0};
	var miposicioncarta={"x":12,"y":6};
	var mitamano = {"x":0,"y":0};
	var miestado=1;
	var micarta=-1;

	var setPosicion = function(posicion)
	{
		mipos["x"]=posicion["x"];
		mipos["y"]=posicion["y"];
	}

	var setGiro = function(giro)
	{
		migiro["angulo"]=giro["angulo"];
		migiro["cx"]=giro["cx"];
		migiro["cy"]=giro["cy"];
	}

	var setTamano = function(tamcart)
	{
		mitamano["x"]=tamcart["x"];
		mitamano["y"]=tamcart["y"];
	}

	var setCarta = function(numero)
	{
		if(numero < 0)
		{
			miposicioncarta["x"]=12;
		    miposicioncarta["y"]=6;
		}else{
		    miposicioncarta["x"]=posicioncarta[numero]["x"];
		    miposicioncarta["y"]=posicioncarta[numero]["y"];
		}
		micarta=numero;
		miestado=0;
	}	

  	var dibuja = function(contexto){
		if(contexto)
		{
			if(migiro["angulo"]!=0)
			{
				contexto.save();
				contexto.translate(migiro["cx"],migiro["cy"]);	
				contexto.rotate(migiro["angulo"]);	
			}

		  	contexto.drawImage(imgc , sx+sW*miposicioncarta["x"], sy+sH*miposicioncarta["y"], sW, sH, mipos["x"], mipos["y"], mitamano["x"], mitamano["y"]);
		  	if(migiro["angulo"]!=0)
			{
		  		contexto.restore();
		  	}
		}
	};

	var destapar = function(numero,contexto)
	{
		if(numero < 0)
		{
			miposicioncarta["x"]=12;
		    miposicioncarta["y"]=6;
		}else{
		    miposicioncarta["x"]=posicioncarta[numero]["x"];
		    miposicioncarta["y"]=posicioncarta[numero]["y"];
		}
		micarta=numero;
		miestado=0;
		dibuja(contexto);
	}

	var comprueba = function(carta)
	{
		var aux=carta-13*Math.floor(carta/13);
		var aux2=micarta-13*Math.floor(micarta/13);
		if(aux==aux2)
			return true;
		return false;
	}

  	var dentro = function(pos)
	{
		var x=pos["x"];
		var y=pos["y"];
		
		if(migiro["angulo"]!=0)
		{
			x-=migiro["cx"];
			y-=migiro["cy"];
			var x2 =parseInt( (Math.cos(-migiro["angulo"])*x) - (Math.sin(-migiro["angulo"])*y) );
			y=parseInt( (Math.sin(-migiro["angulo"])*x) + (Math.cos(-migiro["angulo"])*y) );
			x=x2;
			
		}
		if(x>=mipos["x"] && y>=mipos["y"] && x<=(mipos["x"]+mitamano["x"]) && y<=(mipos["y"]+mitamano["y"]))
    		return true;
    	
  		return false;
	}
  	
  	return {
  		carta: micarta,
  		giro: migiro,
  		setPosicion: setPosicion,
  		getPosicion: mipos,
  		setGiro: setGiro,
  		getGiro: migiro,
  		setTamano: setTamano,
  		setCarta: setCarta,
  		dibuja: dibuja,
  		destapar: destapar,
  		comprueba: comprueba,
  		dentro: dentro
  	}
} 

//Mi clase lista carta
/*****************************************************************/
function lista_Cartas()
{
	var cartas=[];

	var inicia = function(numcartas,json_posiciones)
	{
		cartas=[];
		if(numcartas==json_posiciones.length)
		{
			cartas=[];
			for(var i=0;i<numcartas;i++)
				cartas.push(new Carta(json_posiciones[i]["x"],json_posiciones[i]["y"]));
		}else{
			console.log("Se ha introducido datos erroneos");
		}
	}

	var inicia2 = function(numcartas,json_posiciones,cartasr)
	{
		cartas=[];
		if(numcartas==json_posiciones.length && numcartas==cartasr.length)
		{
			cartas=[];
			for(var i=0;i<numcartas;i++)
			{
				cartas.push(new Carta(json_posiciones[i]["x"],json_posiciones[i]["y"]));
				cartas[i].setCarta(cartasr[i]);
			}
		}else{
			console.log("Se ha introducido datos erroneos");
		}
	}

	var anadirCarta = function(indice,carta)
	{
		cartas[indice]=carta;
	}

	var eliminarCarta = function(indice)
	{
		if(cartas[indice])
			cartas.splice(indice,1);
	}

	var is = function(indice)
	{
		if(cartas[indice])
			return true;
		return false;
	}
	var setTamano = function(tamcart)
	{
		for(var i=0,tamano=cartas.length;i<tamano;i++)
			cartas[i].setTamano(tamcart);
	}

	var setPosicion = function(pos)
	{
		if(pos)
		{
			var tamano=cartas.length;
			if(pos.length==tamano)
			{
				for(var i=0;i<tamano;i++)
					cartas[i].setPosicion(pos[i]);
			}
		}
	}

	var getPosicion = function()
	{
		var res;
		for(var i=0,tamano=cartas.length;i<tamano;i++)
				res.push(cartas[i].getPosicion());
		return res;
	}

	var setGiro = function(giros)
	{
		if(giros.length==cartas.length)
		{
			for(var i=0,tamano=cartas.length;i<tamano;i++)
				cartas[i].setGiro(giros[i]);
		}
	}

	var getGiro = function()
	{
		var res;
		for(var i=0,tamano=cartas.length;i<tamano;i++)
				res.push(cartas[i].getGiro());
		return res;
	}

	var dibuja = function(contexto)
	{
		for(var i=0,tamano=cartas.length;i<tamano;i++)
			cartas[i].dibuja(contexto);
	}

	var destapar = function(carta,indice,contexto)
	{
		cartas[indice].destapar(carta,contexto);
	}

	var comprueba = function(carta)
	{
		for(var i=0,tamano=cartas.length;i<tamano;i++)
		{
			if(cartas[i].comprueba(carta))
				return  true;
		}
		return false;
	}

	var dentro = function(pos)
	{
		for(var i=0,tamano=cartas.length;i<tamano;i++)
		{
			if(cartas[i].dentro(pos))
			{
				return {
					boolean: true,
					i: i
				}
			}
		}
		return {
				boolean: false
		}
	}

	var dentro2 = function(pos)
	{
		for(var i=cartas.length-1;i>=0;i--)
		{
			if(cartas[i].dentro(pos))
			{
				return {
					boolean: true,
					i: i
				}
			}
		}
		return {
				boolean: false
		}
	}

	return {
		inicia: inicia,
		inicia2: inicia2,
		anadirCarta: anadirCarta,
		eliminarCarta: eliminarCarta,
		is: is,
		setTamano: setTamano,
		setPosicion: setPosicion,
		getPosicion: getPosicion,
		setGiro: setGiro,
		getGiro: getGiro,
		dibuja: dibuja,
		destapar: destapar,
		comprueba: comprueba,
		dentro: dentro,
		dentro2: dentro2
	}
}


//Mi clase croupier
function croupier(canvas,contexto)
{
	var miMazo = new Mazo(numcartasmazo);
	var milista_Cartas = new lista_Cartas();
	var miBarra = new Barra({"x":0,"y":0},{"x":0,"y":0},0);
	var micanvas = canvas;
	var micontexto = contexto;
	var informacion = [];
	var miangulo;
	var margenes ={	"margen":0, "y":{"superior":micanvas.width*margen_y_superior,"inferior":micanvas.width*margen_y_inferior}};
	var miestado;
	var cartaenjuego;
	
	var dibuja = function(tiempo_inicial)
	{
		var tiempo_actual=(new Date()).getTime();
		if(miestado=="tapete")
		{
			micanvas.width=micanvas.width;
			milista_Cartas.dibuja(micontexto);	
		} else if(miestado=="barra") {
			micanvas.width=micanvas.width;
			//Primer caso
			if(tiempo_inicial==undefined)
			{
				tiempo_inicial=(new Date()).getTime();
			}
			// update
        	var tiempo = tiempo_actual - tiempo_inicial;
			miBarra.dibuja(micontexto,tiempo);
			// request new frame			
        	requestAnimFrame(function() {
          		dibuja(tiempo_actual);
        	});
		} else if(miestado=="juego") {
			micanvas.width=micanvas.width;
		} else if(miestado=="fin"){
			micanvas.width=micanvas.width;
		}
		
	}

	var cargarImagen = function (callback)
	{
		imgc = new Image();
		imgc.onload = callback;
		imgc.src = '../img/baraja.jpg';
	}

	var inicia = function()
	{
		miestado ="tapete";
		cargarImagen(function(canvas,contexto){
			miMazo.reiniciar();
			miangulo=2*Math.random()*Math.PI/3;
			for(var i=0,tamano=miMazo.numcartas;i<tamano;i++)
		  	{
		  			//Genero aleatorio para que unas cartas esten encima de otras
	  			var aleatorio;
	  			do
	  			{
	  				aleatorio=parseInt(Math.floor(Math.random()*(miMazo.numcartas)));
	  			}while(milista_Cartas.is(aleatorio));
	  			//Meto de izquierda a derecha mis cartas en el array
	  			var y=Math.random();
	  			var angulo=Math.random();
	  			milista_Cartas.anadirCarta(aleatorio,new Carta(0,y));
	  			informacion[i]={"path":aleatorio,"y":y};
	  		}
			//Aqui mi condigo para redimensionar mi Canvas
			resize(micanvas);
			//Añadimos evento de resize
  			window.addEventListener("resize", function (evt){  
	    		resize(micanvas);
	  		},false);
  			//Añadimos un addEventListener al canvas, para reconocer el click
  			micanvas.addEventListener("click", function (evt){  
	  			//Obtengo la posicion del ratón
	    		click(getMousePos(micanvas, evt));
	  		}, false);	
  		});
	}
	//Funcion que sirve para recolocar las cartas cuando es necesario
	var recolocar = function ()
	{
		var limite={	"y":{	"superior":margenes["y"]["superior"]-margenes["y"]["superior"]*decremento_y_superior*miMazo.cartasSacadas(),
								"inferior":margenes["y"]["inferior"]-margenes["y"]["inferior"]*decremento_y_inferior*miMazo.cartasSacadas()}};

		var width=micanvas.width;
		var posicion_x=-((width - 2*(margenes["margen"]+limite["y"]["superior"]))/2)*(sW/sH)/2;
		
		var giros=[];
		for(var i=0,tamano=informacion.length;i<tamano;i++)
		{
			
			giros[informacion[i]["path"]]={	"angulo":(2*(i+1)*Math.PI/(tamano))+miangulo,
											"cx":width/2,"cy":width/2,
											"x":posicion_x,
											"y":(limite["y"]["superior"]-limite["y"]["inferior"])*informacion[i]["y"]+limite["y"]["inferior"]};
		}

		milista_Cartas.setPosicion(giros);
		milista_Cartas.setGiro(giros);

		var posicion={"x":micanvas.width*0.4,"y":micanvas.height*0.025};
		miBarra.setPosicion(posicion);
		dibuja();
	}
	//Funcion que sirve para cambiar los tamaños de las cartas
	var resize = function(canvas)
	{
		if(window.innerWidth<window.innerHeight)
		{
			micanvas.width = window.innerWidth;
		  	micanvas.height = window.innerWidth;
		}else{
			micanvas.width = window.innerHeight;
		  	micanvas.height = window.innerHeight;
		}
		var tamanos={"x":0,"y":0},width=micanvas.width;
		margenes["margen"]=width*margen;
	  	margenes["y"]["superior"]=width*margen_y_superior;
	  	margenes["y"]["inferior"]=width*margen_y_inferior;

	  	tamanos["y"]= width/2 - (margenes["margen"]+margenes["y"]["superior"]);
	  	tamanos["x"]= (sW/sH)*tamanos["y"];
	  	milista_Cartas.setTamano(tamanos);

	  	tamanos["x"]=width*0.1;
	  	tamanos["y"]=micanvas.height*0.95;
	  	miBarra.setTamano(tamanos);

	  	recolocar();
	}
	//Mi funcion para encontrar en informacion quien soy
	var buscar =function(json,dato)
	{
		for(var i=0,tamano=json.length;i<tamano;i++)
		{
			if(json[i]["path"]==dato)
				return i;
		}
		return -1;
	}
	//Mi funcion que dicta que se hace cuando existe un click
	var click = function(pos)
	{
		if(miestado=="tapete")
		{	
			var click = milista_Cartas.dentro2(pos);
			cartaenjuego = click.i;
			if(click.boolean)
				jugar_barra();

		} else if(miestado=="barra") {

			var click = miBarra.getPosicion();
			if(click)
			{
				jugar_juego();
			} else {
				finaliza_juego();
			}

		} else if(miestado=="juego") {
			miestado="tapete";
			recolocar();
			if(miMazo.cartasRestantes()==3)
			{
				alert("estas jodido amigo");
			}
		} else if(miestado=="fin") {
			inicia();
		}
		
	}
	//Mi funcion que pone la pantalla de la barra
	var jugar_barra = function()
	{
		miestado="barra";
		miBarra.setDificultad(2-miMazo.cartasRestantes()/numcartasmazo);
		dibuja();
	}

	//Mi funcion que pone la pantalla del juego de la carta
	var jugar_juego = function()
	{
		miestado="juego";
		console.log("Esta jugando la carta: "+miMazo.sacarCarta());
		milista_Cartas.eliminarCarta(cartaenjuego);
		informacion.splice(buscar(informacion,cartaenjuego),1);
		for(var i=0,tamano=informacion.length;i<tamano;i++)
		{
			if(informacion[i]["path"]>=cartaenjuego)
				informacion[i]["path"]--;
		}

		dibuja();
	}

	return{
		inicia: inicia,
	}
}

//Cuando cargo mi pagina por primera vez
window.onload = function(){
	//Obtengo mediante mi id el Canvas
  	var canvas = document.getElementById('micanvas');
  	if(window.innerWidth<window.innerHeight)
		{
			micanvas.width = window.innerWidth;
		  	micanvas.height = window.innerWidth;
		}else{
			micanvas.width = window.innerHeight;
		  	micanvas.height = window.innerHeight;
		}
  	//Obtengo contexto mediante mi canvas
  	var contexto = canvas.getContext('2d');

  	if(canvas && contexto)
  	{
  		var microupier = new croupier(canvas,contexto);
  		microupier.inicia();
	}
}