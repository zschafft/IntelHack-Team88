var game;

var GD = {
    level:1,
    score:0,
    totalscore:0,
    deltaCap:1/60,
    isRunning:false,
    speed:100,
    playerX:0,playerY:0,
    scale:20
};

window.onload = function() {
    game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload,
    													create: create,
    													update: update });
};

// Game Callbacks -----
function preload () {
    game.load.image('startBut', 'img/start_button.png');
    game.load.image('stop', 'img/reset_button.png');
    game.load.image('star', 'img/star.png');
    game.load.image('delorean', 'img/smalldelorean.png');
    game.load.image('resetBut', 'img/reset_button.png');
    game.load.image('background', 'img/lotsofstars.jpg');
}

function create () {
    game.add.tileSprite(-150, -285, 800, 600, 'background')
    game.time.deltaCap=GD.deltaCap;
    game.world.setBounds(-1000,-1000,2000,2000);

    initAxes();
    initCurve();
    initLevelData();

    loadlevel(GD.level);

    // init Delorean
    GD.player=game.add.sprite(0,0,'delorean');
    GD.player.anchor.setTo(0.5,0.5);

    initHUD();

    GD.watch('playerX',updatePositionText);
    GD.watch('playerY',updatePositionText);
    GD.watch('score',updateScoreText);
    GD.watch('totalscore',updateTotScoreText);
    GD.watch('level',updateLevelText);
}

function update() {
	// update delorean position
    if (GD.isRunning)
    {
        var oldX = GD.player.x;
        var oldY = GD.player.y;
        GD.playerX += (GD.speed * GD.deltaCap);
        GD.playerY =  -GD.fun(GD.playerX);
        GD.player.angle = 100*(game.math.angleBetween(oldX, oldY, GD.player.x, GD.player.y)) * .58;
    }

    // if we need to redraw, do it
    if(GD.redraw) {
        drawPlot(GD.fun,GD.curveBuff);
    }

    // collision check and see if we're done
    GD.stars.forEach(function(star) {
        if(GD.player.overlap(star)) {
            collectStar(GD.player, star);
        }
    });

    // out of bounds check
    // if (GD.player.x >  game.width-100 ||
    //     GD.player.y <= -game.height/2 || 
    //     GD.player.y >=  game.height/2) 
    // {
    //     GD.running = false;
    //     reset();
    // }

    checkForWin();
}

//----------

// Init helpers

function initLevelData() {
    GD.stars = game.add.group();
    GD.ld = loadJSON('json/levels.json');
}

function initCurve() {
    GD.curveBuff = game.make.bitmapData(800,600,'curve',true);
    GD.curveSprite = game.add.sprite(-game.width/2,-game.height/2,game.cache.getBitmapData('curve'));
    GD.curveBuff.fill(0,0,0,0);
    GD.redraw = false;
}

function initHUD() {
    // Make hud group
    GD.hud = game.add.group();

    // Add buttons
    GD.resetBut = game.add.button(x=(game.width-400)/2,y=(game.height-200)/2, key='resetBut',callback=resetLevel);
    GD.startBut = game.add.button(x=(game.width-200)/2,y=(game.height-200)/2, key='startBut',callback=startTravel);
 
    //Add HUD
    GD.posText = game.add.text((game.width-600)/2, (game.width-300)/2, '', {
        font: "20px Helvetica",
        fill: "white",
        align: "center"
    });

    GD.scoreText = game.add.text((game.width-300)/2, -270, 'Score: ', {
        font: "20px Helvetica",
        style: "bold",
        fill: "white",
        align: "left"
    });

    GD.totalscoreText = game.add.text((game.width-300)/2, -230, 'Total Score: ', {
        font: "20px Helvetica",
        style: "bold",
        fill: "white",
        align: "left"
    });

    GD.levelText = game.add.text(30, -270, '', {
        font: "24px Helvetica",
        style: "bold",
        fill: "white",
        align: "center"
    });

    GD.hud.add(GD.resetBut);
    GD.hud.add(GD.startBut);
    GD.hud.add(GD.posText);
    GD.hud.add(GD.scoreText);
    GD.hud.add(GD.levelText);
    GD.hud.add(GD.totalscoreText);

    GD.hud.x=(game.width-100)/2;
    GD.hud.x=(game.height-100)/2;

    game.camera.follow(GD.hud);
}

function initAxes(){
    //y
    makeColoredRect('yAxis',5,game.height,105,105,105);
    GD.yaxis=game.add.sprite(0,0,game.cache.getBitmapData('yAxis'));
    GD.yaxis.anchor.setTo(0.5,0.5);
    GD.yaxis.z = 0;
    makeColoredRect('yTick',15,5,105,105,105);

    //x
    makeColoredRect('xAxis',game.width + 500,5,105,105,105);
    GD.xaxis=game.add.sprite(0,0,game.cache.getBitmapData('xAxis'));
    GD.xaxis.anchor.setTo(0.5,0.5);
    GD.xaxis.z = 0;
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

function makeStarSprites(arr) {
    GD.stars.removeAll(true); // remove anything in the group and destroy them
    for (var i = 0; i < arr.length; i++) {
        var star = GD.stars.create(arr[i].x, arr[i].y, 'star');
        star.anchor.setTo(0.5, 0.5);
    }
}

function loadlevel(lvl)
{
    var starArr = GD.ld['level'+lvl];
    if(starArr == null) return false; //no level data
    makeStarSprites(starArr);
    GD.score = 0;
    return true;
}

// Textbox Callbacks
function updatePositionText(id,oldval,newval) {
    if(id=='playerX')GD.player.x = newval;
    if(id=='playerY')GD.player.y = newval;
    GD.posText.setText("Position: (" + Math.floor(GD.player.x) + "," + -Math.floor(GD.player.y) + ")");
    return newval;
}

function updateScoreText(id,oldval,newval) {
    GD.scoreText.setText("Score: "+newval);
    return newval;
}

function updateTotScoreText(id,oldval,newval) {
    GD.totalscoreText.setText("Score: "+newval);
    return newval;
}

function updateLevelText(id,oldval,newval) {
    GD.levelText.setText("Level: "+newval);
    return newval;
}

// Game events
function startTravel(){
    //Grab text
    GD.fun = symToFn(textBox());
    GD.redraw = true;
    GD.isRunning = true;
}


function checkForWin() {
    if(GD.stars.countLiving()==0) {
        GD.level++;
        if(!loadlevel(GD.level)) gameOver();
        resetLevel();
    }
}

function collectStar(player, star) {
    if(star.alive == true)
    {
        star.kill();
        GD.score += 1;
        GD.totalscore +=1;
    }
}

function resetLevel() {
    GD.curveBuff.clear();
    GD.isRunning = false;
    GD.playerX = 0;
    GD.playerY = 0;
    GD.player.angle = 0;
    GD.stars.callAllExists('revive',false);
}

function gameOver() {
    alert("You did it. Aren't you proud?");
}

// Utils
function textBox() {
    return document.getElementById('inputbox').value
}

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

function makeRandomColor() {
    var r = game.rnd.between(175,255);
    var b = game.rnd.between(175,255);
    var g = game.rnd.between(175,255);
    var colorString = "rgb(" + r + "," + g + "," + b +")";
    return colorString;
}

function symToFn(string) {
    var exp = Parser.parse(string);
    return function(x) {
        return GD.scale*exp.evaluate({x:x/GD.scale});
    }
}

function loadJSON(file) {
    var request = new XMLHttpRequest();
    request.open("GET", file, false);
    request.send(null)
    var res = JSON.parse(request.responseText);
    return res;
}


// Graphing
function drawPlot(fn,bmd) {
    bmd.clear();
    var canvas = bmd.canvas;

    var axes={}, ctx=canvas.getContext("2d");
    axes.x0 = .5 + .5*canvas.width;  // x0 pixels from left to x=0
    axes.y0 = .5 + .5*canvas.height; // y0 pixels from top to y=0
    axes.scale = 1;                 // 20 pixels from x=0 to x=1
    axes.doNegativeX = true;

    funGraph(ctx,axes,fn,makeRandomColor(),3); 
    GD.redraw = false;
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

function fun1(x) {return Math.sin(x);}
function fun2(x) {return Math.cos(3*x);}
function exampleFn(x) {return x;}
function exampleFn2(x) {return x*x;}
