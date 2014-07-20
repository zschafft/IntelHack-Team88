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
    GD.ld = loadJSON('json/levels.json');
    //test array will be replaced with results from JSON

    cursors = game.input.keyboard.createCursorKeys();

    //Add axis
    makeStarSprites(GD.ld["level1"]);

    //Create Axis
    makeAxes();

    // vars for drawing func
    GD.fun = exampleFn;
    GD.curveBuff = game.make.bitmapData(800,600,'curve',true);
    GD.curveSprite = game.add.sprite(-game.width/2,-game.height/2,game.cache.getBitmapData('curve'));
    GD.curveBuff.fill(0,0,0,0);
    GD.redraw = true;

    draw();
}

function update() {
	//update loop

	GD.posText.setText("Position: (" + GD.player.x + "," + GD.player.y + ")");
    if (cursors.up.isDown)
    {
        GD.player.y = GD.player.y - 10;
    }
    if(cursors.down.isDown)
    {
        GD.player.y = GD.player.y + 10;
    }
    if(cursors.left.isDown)
    {
        GD.player.x = GD.player.x - 10;
    }
    if(cursors.right.isDown)
    {
        GD.player.x = GD.player.x + 10;
    }
    stars.forEach(function(star) {

        if(collides(GD.player, star))
            
            {
        console.log('collision!');
            }   
    })

	GD.posText.setText("Position: (" + GD.player.x/20 + "," + GD.player.y/20 + ")");
    redrawPlot(GD.fun,GD.curveBuff);
}

function collides (a, b) 
    {
       
        if(a != undefined)
        {
            return !(
                ((a.y + a.height) < (b.y)) ||
                (a.y > (b.y + b.height)) ||
                ((a.x + a.width) < b.x) ||
                (a.x > (b.x + b.width))
            );  
        }
}  
  
//----------

function StartGame(){
	//Grab text
    GD.fun = symToFn(textBox());
    debugger;
    GD.redraw = true;
    GD.running = true;
}

function textBox() {
    return document.getElementById('inputbox').value
}

function makeAxes(){

    //y
    makeColoredRect('yAxis',5,game.height,105,105,105);
    GD.yaxis=game.add.sprite(0,0,game.cache.getBitmapData('yAxis'));
    GD.yaxis.anchor.setTo(0.5,0.5);
    makeColoredRect('yTick',15,5,105,105,105);

    //x
    makeColoredRect('xAxis',game.width + 500,5,105,105,105);
    GD.xaxis=game.add.sprite(0,0,game.cache.getBitmapData('xAxis'));
    GD.xaxis.anchor.setTo(0.5,0.5);
    makeColoredRect('xTick',5,15,105,105,105);

    plotTicks();
}

function plotTicks(){
    var tick;
    for(var x=-160;x<=game.width;x+=20) {
        tick = game.add.sprite(x,0,game.cache.getBitmapData('xTick'));
        tick.anchor.setTo(0.5,0.5);
    }
    
    for(var y=-300;y<=game.height;y+=20) {
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
    // var re = new RegExp("\\d*x\\^\\d*");
    var parts = [NamedRegExp("(<c> \\d*)x\\^(<e> \\d*)",string)];
    debugger;
 	return function(x) {
		var total = evalFactor(parts[0],x);
 		for(var i=1;i<total.length;i+=2) {
 			if (parts[i]) total+=evalFactor(parts[i+1],x);
			else total-=evalFactor(parts[i+1],x);
 		}
		return total;
	}
}

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
}

function redrawPlot(fn,bmd) {
    if(!GD.redraw) return;
    GD.curveBuff.fill(0,0,0,0);
    draw(fn,bmd.canvas);
    GD.redraw = false;
}

function fun1(x) {return Math.sin(x);  }
function fun2(x) {return Math.cos(3*x);}
function exampleFn(x) {
    return x;
}

function exampleFn2(x) {
    return x*x;
}

function draw(fn,canvas) {
    if (null==canvas || !canvas.getContext) return;

    var axes={}, ctx=canvas.getContext("2d");
    axes.x0 = .5 + .5*canvas.width;  // x0 pixels from left to x=0
    axes.y0 = .5 + .5*canvas.height; // y0 pixels from top to y=0
    axes.scale = 40;                 // 40 pixels from x=0 to x=1
    axes.doNegativeX = true;

    showAxes(ctx,axes);
    funGraph(ctx,axes,fn,"rgb(11,153,11)",1); 
}

function funGraph (ctx,axes,func,color,thick) {
    var xx, yy, dx=4, x0=axes.x0, y0=axes.y0, scale=axes.scale;
    var iMax = Math.round((ctx.canvas.width-x0)/dx);
    var iMin = axes.doNegativeX ? Math.round(-x0/dx) : 0;
    ctx.beginPath();
    ctx.lineWidth = thick;
    ctx.strokeStyle = color;

    for (var i=iMin;i<=iMax;i++) {
    xx = dx*i; yy = scale*func(xx/scale);
    if (i==iMin) ctx.moveTo(x0+xx,y0-yy);
    else         ctx.lineTo(x0+xx,y0-yy);
    }
    ctx.stroke();
}

function showAxes(ctx,axes) {
    var x0=axes.x0, w=ctx.canvas.width;
    var y0=axes.y0, h=ctx.canvas.height;
    var xmin = axes.doNegativeX ? 0 : x0;
    ctx.beginPath();
    ctx.strokeStyle = "rgb(128,128,128)"; 
    ctx.moveTo(xmin,y0); ctx.lineTo(w,y0);  // X axis
    ctx.moveTo(x0,0);    ctx.lineTo(x0,h);  // Y axis
    ctx.stroke();
}

function NamedRegExp(pattern, string) {
    pattern=pattern.toString();
    var result = [];
    var groupRX = /\(\<(.*?)\>\s(.*?)\)/;
    while (groupRX.test(pattern)) {
        var match = groupRX.exec(pattern);
        result.push({
            name : match[1],
            pattern : match[2],
            value : null
        });
        pattern = pattern.replace(groupRX, '('+match[2]+')');
    }

    var finalMatch=(new RegExp(pattern)).exec(string);
    if(finalMatch) {
        for ( var i=0, len=result.length; i<len; i++) {
            if(finalMatch[(i+1)]!==false) {
                result[i].value=finalMatch[(i+1)];
            }
        }
    }

    var output = {};

    for(var i = 0;i<result.length;i++) {
        output[result[i].name]=result[i].value;
    }
    return output;
};