var game;
var GD = {};

window.onload = function() {
    game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload,
    													create: create,
    													update: update });
};

// Game Callbacks -----
function preload () {
    game.load.image('start','img/start_button.png');
}

function create () {
    loadJSON('json/levels.json');

    game.stage.backgroundColor = 0x000053
    //make world bigger
    game.world.setBounds(-1000,-1000,2000,2000);

    // Make hud group
    GD.hud = game.add.group();

  	//Add button
    var button = game.add.button(x=''+(game.width-200)/2,y=''+(game.height-200)/2, key='start',callback=StartGame);
    // button.anchor.setTo(0.2, 0.5);

    //Add position
    GD.posText = game.add.text(''+(game.width-300)/2, ''+(game.width-300)/2, '', {
        font: "20px Arial",
        fill: "#ff0044",
        align: "center"
    });

    GD.hud.add(button);
    GD.hud.add(GD.posText);

    GD.hud.x=(game.width-100)/2;
    GD.hud.x=(game.height-100)/2;

    game.camera.follow(GD.hud);

    //Delorean
    makeRect('delorean',50,50);
    GD.player=game.add.sprite(0,0,game.cache.getBitmapData('delorean'));
    GD.running=false;

    //Stars
    makeRect('star', 25, 25);
    stars = game.add.group();
    
    //test array will be replaced with results from JSON
    var testArray = [{x:100,y:150},{x:50,y:200},{x:200,y:70},{x:500,y:500}];
    makeStarSprites(testArray);

    //Add axis


    // vars for drawing func
    GD.pix = game.context.createImageData(1,1); // only do this once per page
    GD._pix  = GD.pix.data;                           // only do this once per page
}

function update(tpf) {
	//update loop
	GD.posText.setText("Position: (" + GD.player.x + "," + GD.player.y + ")");
}
//----------

function StartGame(){
	//Grab text
  	alert(textBox());
}

function textBox() {
    return document.getElementById('inputbox').value
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

 	//  split polynomial on [+-]
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

function loadJSON(file) {
    var request = new XMLHttpRequest();
    request.open("GET", file, false);
    request.send(null)
    var res = JSON.parse(request.responseText);
    return res;
};

function makeAxis() {
    // make X axis

    // make y axis
}

function redrawPlot(fn,bmd) {
    GD._pix[0] = 0;
    GD._pix[1] = 0;
    GD._pix[2] = 0;
    GD._pix[3] = 0;
    for(var x=0;x<bmd.width;x++) {
        myContext.putImageData(GD.pix, x, fn(x));   
    }
}