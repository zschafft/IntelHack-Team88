var game;
var GD = {};

window.onload = function() {
    game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
};

// Game Callbacks -----
function preload () {
    game.load.image('logo', 'phaser.png');
}

function create () {
    // var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
    // logo.anchor.setTo(0.5, 0.5);

    makeRect('delorean',50,50);
    GD.player=game.add.sprite(0,0,game.cache.getBitmapData('delorean'));
    var JSONarray = loadJSON()
    GD.fun='';
    GD.running=false;

    game.camera.x = -200;
}

function update() {
	//update loop
}
//----------

// Utils
function makeColoredRect(key, width, height, r, g, b) {
	var rect = game.make.bitmapData(width,height,key,true);
	rect.fill(r,g,b,1);
}

function makeRect(key, width, height) {
	var r = game.rnd.between(0,255);
	var b = game.rnd.between(0,255);
	var g = game.rnd.between(0,255);
	return makeColoredRect(key, width, height, r,g,b);
}

//Parsing Functions

// ex:
// s = textbox.getText();
// f = symToFn(s);
// for(int x=0;x<canvas.width;x++) {
// 	canvas.drawPixel(x,f(x));
// }

function symToFn(string) {
// 	//  split polynomial on [+-]
// 	// ex: '5x^2 + 3x - 10' -> var parts = [{c:5,e:2},true,{c:3,e:1},false,{c:10,e:0}]
 	debugger;
 	var parts = string.match(([/d]*x/^[/d][+-])+|[/d]*/g);
 	var parts = string.replace("+", true);
 	var parts = string.replace("-", false);
 	return function(x) {
		var total = evalFactor(parts[0],x);
 		for(int i=1;i<total.size();i+=2) {
 			if (parts[i]) total+=evalFactor(parts[i+1],x);
			else total-=evalFactor(parts[i+1],x);
 		}
		return total;
	}
}

function evalFactor(f,x) {
 	return f.c*Math.pow(x,f.e);
}

// where arr = [{x:100,y:100},{x:200,y:150}];

function makeStarSprites(arr) {
	// for(int i=0;i<arr.size();i++) {
	// 	GD.stars.add(game.add.sprite('star',arr[i].x,arr[i].y))
	// }
}

function loadJSON(filename) {
	// load filename
	// return JSON object
}