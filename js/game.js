var game;
var GD = {};

window.onload = function() {
    game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload,
    													create: create,
    													update: update });
};

// Game Callbacks -----
function preload () {
    game.load.image('logo', 'img/phaser.png');
    game.load.image('start','img/start_button.png');
}



function create () {
    // var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
    // logo.anchor.setTo(0.5, 0.5);

    var JSONarray = loadJSON();

    makeRect('delorean',50,50);
    GD.player=game.add.sprite(0,0,game.cache.getBitmapData('delorean'));
    GD.running=false;

    //add stars
    makeRect('star', 25, 25);
    stars = game.add.group();
    //test array will be replaced with results from JSON
    var testArray = [{x:100,y:150},{x:50,y:200},{x:200,y:70},{x:500,y:500}];
    makeStarSprites(testArray);

  	//Add button
    button = game.add.button(x='600',y='550', key='start',callback=StartGame);
    button.anchor.setTo(0.2, 0.5);

    //Add position
    GD.fun = game.add.text('740', '550', '', {
        font: "20px Arial",
        fill: "#ff0044",
        align: "center"
    });

    var textBmD = game.make.bitmapData(350,50,'textbox',true);
    var tbSprite = game.add.sprite(100,100,game.cache.getBitmapData('textbox'));
    var inputBox = new CanvasInput({
      canvas: textBmD.canvas,
      fontSize: 18,
      fontFamily: 'Arial',
      fontColor: '#212121',
      fontWeight: 'bold',
      width: 300,
      padding: 8,
      borderWidth: 1,
      borderColor: '#000',
      borderRadius: 3,
      boxShadow: '1px 1px 0px #fff',
      innerShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)',
      placeHolder: 'Enter message here...'
    });
}

function update() {
	//update loop

	GD.fun.setText("Position: (" + GD.player.x + "," + GD.player.y + ")");

}
//----------

function StartGame(){

	//Move Delorean
  	alert("Cicked on button!");	

}

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
 	var parts = string.match("([/d]*x/^[/d][+-])+|[/d]*");
 	var parts = string.replace("+", true);
 	var parts = string.replace("-", false);

 	return function(x) {
		var total = evalFactor(parts[0],x);
 		for(var i=1;i<total.size();i+=2) {
 			if (parts[i]) total+=evalFactor(parts[i+1],x);
			else total-=evalFactor(parts[i+1],x);
 		}
		return total;
	}
}

function testRegex(string) {
    //var regex = new RegExp("([/d]*x/^[/d][+-])+|[/d]*)");
    
    var regex = new RegExp("[0-9]*x");
    var parts = regex.exec(string);
    //var parts = string.match(([/d]*x/^[/d][+-])+|[/d]*/g);
    //var parts = .replace("+", "plus");
   // var parts = string.replace("+", true);
   // var parts = string.replace("-", false);
    //var parts = string;
    return parts;
}

	//  split polynomial on [+-]
	// ex: '5x^2 + 3x - 10' -> var parts = [{c:5,e:2},true,{c:3,e:1},false,{c:10,e:0}]
// 	return function(x) {
// 		var total = evalFactor(parts[0],x);
// 		for(int i=1;i<total.size();i+=2) {
// 			if (parts[i]) total+=evalFactor(parts[i+1],x);
// 			else total-=evalFactor(parts[i+1],x);
// 		}
// 		return total;
// 	}

function evalFactor(f,x) {
 	return f.c*Math.pow(x,f.e);
}

// where arr = [{x:100,y:100},{x:200,y:150}];

function makeStarSprites(arr) {

	 for (var i = 0; i < arr.length; i++) {
        var star = stars.create(arr[i].x, arr[i].y, game.cache.getBitmapData('star'));
	}
}

function loadJSON(filename) {
	// load filename
   // var JSONtext = $.getJSON(filename);
	// return  eval('(' + JSONtext + ')');
 //    debugger;
}
