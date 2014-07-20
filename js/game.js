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
        fill: "red",
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
    GD.player.anchor.setTo(0.5,0.5);
    GD.running=false;

    //Stars
    makeRect('star', 25, 25);
    stars = game.add.group();
    jsonText = loadJSON('json/levels.json');
    //test array will be replaced with results from JSON

    console.log(jsonText["level1"]);
    makeStarSprites(jsonText["level1"]);

    //Create Axis
    makeAxes();

    


    // vars for drawing func
    GD.fun = exampleFn;
    GD.curveBuff = game.make.bitmapData(800,600,'curve',true);
    GD.curveSprite = game.add.sprite(0,0,game.cache.getBitmapData('curve'));
    GD.curveBuff.fill(0,0,0,0);
    GD.redraw = true;
}

function update() {
	//update loop
	GD.posText.setText("Position: (" + GD.player.x + "," + GD.player.y + ")");
    redrawPlot(GD.fun,GD.curveBuff);
}
//----------

function StartGame(){
	//Grab text
    debugger;
    GD.fun = exampleFn2;
    GD.redraw = true;
}

function textBox() {
    return document.getElementById('inputbox').value
}

function makeAxes(){

    //y
    makeColoredRect('yAxis',5,600,105,105,105);
    GD.yaxis=game.add.sprite(0,0,game.cache.getBitmapData('yAxis'));
    GD.yaxis.anchor.setTo(0.5,0.5);
    makeColoredRect('yTick',15,5,105,105,105);

    //x
    makeColoredRect('xAxis',850,5,105,105,105);
    GD.xaxis=game.add.sprite(0,0,game.cache.getBitmapData('xAxis'));
    GD.xaxis.anchor.setTo(0.5,0.5);
    makeColoredRect('xTick',5,15,105,105,105);

    plotTicks();

}

function plotTicks(){
    var tick;
    for(var x=-155;x<=game.width;x+=20) {
        tick = game.add.sprite(x,0,game.cache.getBitmapData('xTick'));
        tick.anchor.setTo(0.5,0.5);
    }
    
    for(var y=-315;y<=game.height;y+=20) {
        tick =game.add.sprite(0,y,game.cache.getBitmapData('yTick'));
        tick.anchor.setTo(0.5,0.5);
    }

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

function exampleFn(x) {
    return x;
}

function exampleFn2(x) {
    return x*x;
}

function redrawPlot(fn,bmd) {
    if(!GD.redraw) return;
    debugger;
    GD.curveBuff.fill(0,0,0,0);
    for(var x=0;x<bmd.width;x++) {
        GD.curveBuff.setPixel(x,Math.floor(fn(x/10)),0,0,0,1,true);  
    }
    GD.redraw = false;
}
