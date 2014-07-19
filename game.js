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
    GD.fun='';
    GD.running=false;

    //button = game.add.button(x='400',y='400', callback=Click_Button);
        
   	button = game.add.button(game.world.centerX, game.world.centerY, 'button', Click_Button, this, 2, 1, 0);

    //	Set the anchor of the sprite in the center, otherwise it would rotate around the top-left corner
    button.anchor.setTo(0.5, 0.5);

}

function update() {
	//update loop
}
//----------

function Click_Button(){
  	alert("Cicked on button!");
        }

// Utils
function makeColoredRect(key, width, height, r, g, b) {
	var rect = game.make.bitmapData(width,height,key,true);
	rect.fill(r,g,b,1);
}

function makeRect(key, width, height) {
	debugger;
	var r = game.rnd.between(0,255);
	var b = game.rnd.between(0,255);
	var g = game.rnd.between(0,255);
	return makeColoredRect(key, width, height, r,g,b);
}
>>>>>>> be66541a50f8d62e8c013413b9eb40e481085d5b
