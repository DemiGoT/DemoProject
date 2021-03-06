function Canvas() {
"use strict";
var Earth = function ( ) {
  this.R  = 0,
	this.oX = 0,
	this.oY = 0,
	this.pX = 10,
	this.pY = 10;
	this.longitude_indexing  = 10,
	this.latitude_indexing   = 10,
	this.longitude_density   = 1,
	this.latitude_density    = 1,
	this.rotateX = 24,
	this.rotateY = 90,
	this.rotateZ = 0,
	this.rotation_speed = 1.5,
	this.color   = 'rgba( 0 , 0 , 0 , 1 ) '
};
	var mouse = {
        down: false,
        button: 1,
        x: 0,
        y: 0,
        px: 0,
        py: 0
    };		
		var line = {
				color : 'rgba( 100 , 100 , 255 , 0.5 ) ',
				size  : 2
			},

		place_color   = " rgba( 255 , 5 , 5 , 0 ) ",
		places= [ 113 , 34 , 114,34,121,31,116,39, -116,-39],

		mouse={
	        down   : false,
	        button : 1,
	        x      : 0,
	        y      : 0,			
		};

	function sin ( deg ) {
		return  Math.sin( Math.PI / 180 * (deg) );		
	};

	function cos ( deg ) {
		return  Math.cos( Math.PI / 180 * (deg) );	
	};

	function tan ( deg ) {
		return  Math.tan( Math.PI / 180 * (deg) );		
	};
	function atan ( value ) {
		return  Math.atan( value );	
	};


	Earth.prototype.setup = function ( seetings ) {
    var sets = typeof settings==="object" ? settings : {
      W: 897,
      H: 884,
      d: 884,
      speed: 0.5,
      color: "#E0FFFF" 
    };
      this.R = sets.d/2;
		  this.oX = sets.W/2;
		  this.oY = sets.H/2;
	    this.rotation_speed = sets.speed;
	    this.color     = sets.color;
	};

	Earth.prototype.projection_XoY = function ( longitude , latitude ) {

	var x = 0,
		y = 0;

		longitude = longitude + this.rotateY ;
		latitude = 90 - latitude ;

		x  = this.R * sin( latitude ) * cos( longitude ) ;

	var temp = atan( cos( latitude ) / ( sin( latitude ) * sin( longitude ) ) );
		y    = this.R * ( cos( latitude )*cos( this.rotateX ) + sin( latitude ) * sin( longitude ) / cos( temp ) * sin( temp - this.rotateX ) );

		this.pX = this.oX - x ;
		this.pY = this.oY - y ;
	};

	Earth.prototype.draw_point = function ( object , x , y , size , color ) {
		object.fillStyle = color;
		object.fillRect( x , y , size , size );
	};

	Earth.prototype.warps = function ( object ) {
		// 36 经线；
		for( var i=0 ; i<360 ; i += this.longitude_indexing ){
			for( var j=90 ; j>=-90 ; j -= this.longitude_density ){
				this.projection_XoY( i , j );
				this.draw_point( object , this.pX , this.pY , line.size , this.color );
			}
		}
	};

	Earth.prototype.wefts = function ( object ) {
		for( var j=90 ; j>=-90 ; j -= this.latitude_indexing ){
			for( var i=0 ; i<360 ; i += this.latitude_density ){
				this.projection_XoY( i , j );
				this.draw_point( object , this.pX , this.pY , line.size , this.color );
			}
		}
	};

	Earth.prototype.incenter = function( object ) {
		this.draw_point( object , this.oX , this.oY , 2 , place_color );
	};

	Earth.prototype.callout = function ( object , text , color , x , y , font_family , size , align ) {
		object.fillStyle = color;
		object.font      = "bold" + " " + size + "pX" + " " + font_family;
		object.textAlign = align;
		object.fillText( text , x , y );
	};

	Earth.prototype.mark_places = function ( object , plac ) {
		for ( var i=0; i<=plac.length ; i+=2 ) {
			this.projection_XoY( this.R , plac[i] , plac[i+1] );
			this.draw_point( object , this.pX , this.pY , 2 , place_color );
		}
	};

	Earth.prototype.rotation_speed_set = function() {
		if( this.rotateY != 360 ){
			this.rotateY += this.rotation_speed;				
		}else{
			this.rotateY = 0;
		}
	};

	Earth.prototype.rotation = function ( object ) {
		this.rotation_speed_set();
		this.draw_in( object );
	};

	Earth.prototype.draw_in = function ( object ) {
		this.warps( object );
		this.wefts( object );
		this.incenter( object );
		
		this.mark_places( object , places );
	};

	Earth.prototype.show_in=function ( object ) {
		this.rotation( object );
	};

window.requestAnimFrame = 
		window.requestAnimationFrame      ||
		window.webkitRequestAnimationFrame  ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame     ||
		window.msRequestAnimationFrame			||
		function (callback) {
				window.setTimeout(callback, 1000 / 60);
		};

window.onload = function(){
var	canvas  = document.getElementById('canvas'),
		img     = canvas.getContext("2d"),
		canvas_W = canvas.width,
		canvas_H = canvas.height;
var	earth = new Earth();
		earth.setup({
      W: canvas_W,
      H: canvas_H,
      d: 280,
      speed: 2.5,
      color: "rgba( 100 , 100 , 255 , 1 )" 
    });
   (function earth_rotation () {
		   img.clearRect( 0 , 0 , canvas.width , canvas.height );
		   earth.show_in( img );
		   earth.callout( img , "", '#fff',55,180,'黑体', 10 ,"start");
		   requestAnimationFrame( earth_rotation );
	  })();
		control( canvas , earth );
};
};