var game;

var GD = {
    level:1,
    score:0,
    totalscore:0,
    starsCollected:false,
    deltaCap:1/60
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
    game.load.image('delorean', 'img/delorean.png');
    game.load.image('resetBut', 'img/reset_button.png');
}

function create () {
    game.stage.backgroundColor = 0x000053
    game.time.deltaCap=GD.deltaCap;

    //make world bigger
    game.world.setBounds(-1000,-1000,2000,2000);

    // Make hud group
    GD.hud = game.add.group();

    // Add buttons
    var startBut = game.add.button(x=(game.width-400)/2,y=(game.height-200)/2, key='resetBut',callback=reset);
    var resetBut = game.add.button(x=(game.width-200)/2,y=(game.height-200)/2, key='startBut',callback=StartGame);
 
    //Add HUD
    GD.posText = game.add.text((game.width-300)/2, (game.width-300)/2, '', {
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

    GD.hud.add(resetBut);
    GD.hud.add(GD.posText);
    GD.hud.add(GD.scoreText);
    GD.hud.add(GD.levelText);
    GD.hud.add(GD.totalscoreText);

    GD.scoreText.setText("Score: 0");
    GD.totalscoreText.setText("Total Score: 0");

    GD.hud.x=(game.width-100)/2;
    GD.hud.x=(game.height-100)/2;

    game.camera.follow(GD.hud);

    GD.running=false;

    //Stars
    stars = game.add.group();
    GD.ld = loadJSON('json/levels.json');
    startLevel(GD.level);

    //add cursors
    cursors = game.input.keyboard.createCursorKeys();

    //Create Axis
    makeAxes();

    // vars for drawing func
    //GD.fun = exampleFn;
    GD.curveBuff = game.make.bitmapData(800,600,'curve',true);
    GD.curveSprite = game.add.sprite(-game.width/2,-game.height/2,game.cache.getBitmapData('curve'));
    GD.curveBuff.fill(0,0,0,0);
    GD.redraw = false;

    //Delorean
    GD.player=game.add.sprite(0,0,'delorean');
    GD.player.anchor.setTo(0.5,0.5);
}

function update() {
	//update loop
	GD.posText.setText("Position: (" + Math.ceil(GD.player.x) + "," + -Math.ceil(GD.player.y) + ")");

    if (GD.running)
    {
        if (GD.player.x >  game.width-100 ||
            GD.player.y <= -game.height/2 ||
            GD.player.y >=  game.height/2)
        {
            reset();
            alert("Try Again");
        }
        GD.player.x += 1;
        GD.player.y = -20*GD.fun(GD.player.x/20);
    }

    stars.forEach(function(star) {
        if(GD.player.overlap(star)) {
            collectStar(GD.player, star);
        }   
    })

	GD.posText.setText("Position: (" + Math.ceil(GD.player.x/20) + "," + -Math.ceil(GD.player.y/20) + ")");
    
    redrawPlot(GD.fun,GD.curveBuff);
}

//----------

function StartGame(){
	//Grab text
    GD.fun = symToFn(textBox());
    //debugger;
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
function symToFn(string) {
    var exp = Parser.parse(string);
    return function(x) {
        return exp.evaluate({x:x});
    }
}

function evalFactor(f,x) {
 	return f.c*Math.pow(x,f.e);
}

function makeStarSprites(arr) {
    if(typeof arr == "undefined")
    {
        console.log("You're a winner!");
        GD.scoreText.setText("You win!!!!");
        GD.levelText.setText("You win!!!!");
        return;
    }
	 for (var i = 0; i < arr.length; i++) {
        var star = stars.create(arr[i].x, arr[i].y, 'star');
        star.anchor.setTo(0.5, 0.5);
       // star.events.onKilled.add(function() { score += 10; console.log(score);}, this);
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
    GD.curveBuff.clear();
    draw(fn,bmd.canvas);
    GD.redraw = false;
}

function collectStar(player, star) {
    if(star.alive == true)
    {
        star.kill();
        GD.score += 1;
        GD.totalscore +=1;
        if(stars.countLiving()==0)
        {
            GD.scoreText.setText("All stars collected!");
            GD.starsCollected = true;
            GD.score = 0;
            console.log(GD.starsCollected);
            GD.level = GD.level + 1;
            startLevel(GD.level);
            GD.player.destroy();
            GD.player=game.add.sprite(0,0,'delorean');

            GD.player.anchor.setTo(0.5,0.5);

            GD.running=false;

            return;
        }
        GD.scoreText.setText("Score: " + GD.score);
        GD.totalscoreText.setText("Total Score: " + GD.totalscore);
    }
}

function startLevel(lvl) {
    var starArr = GD.ld['level'+lvl];
    GD.starsCollected = false;
    GD.score = 0;
    GD.scoreText.setText("Score: " + GD.score);
    GD.totalscoreText.setText("Score: " + GD.totalscore);
    GD.levelText.setText("Level " + GD.level);
    makeStarSprites(starArr);
}

function fun1(x) {return Math.sin(x);}
function fun2(x) {return Math.cos(3*x);}
function exampleFn(x) {return x;}
function exampleFn2(x) {return x*x;}

function draw(fn,canvas) {
    if (null==canvas || !canvas.getContext) return;

    var axes={}, ctx=canvas.getContext("2d");
    axes.x0 = .5 + .5*canvas.width;  // x0 pixels from left to x=0
    axes.y0 = .5 + .5*canvas.height; // y0 pixels from top to y=0
    axes.scale = 20;                 // 20 pixels from x=0 to x=1
    axes.doNegativeX = true;

    funGraph(ctx,axes,fn,"rgb(11,153,11)",3); 
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
function collectStar(player, star) {
    if(star.alive == true)
    {
        star.kill();
        GD.score += 1;
        GD.totalscore +=1;
        if(stars.countLiving()==0)
        {
            GD.scoreText.setText("All stars collected!");
            GD.starsCollected = true;
            GD.score = 0;
            console.log(GD.starsCollected);
            startLevel(++GD.level);
            GD.player.destroy();
            GD.curveBuff.clear();
            GD.player=game.add.sprite(0,0,'delorean');
            GD.player.anchor.setTo(0.5,0.5);

            GD.running=false;

            return;
        }
        GD.scoreText.setText("Score: " + GD.score);
        GD.totalscoreText.setText("Total Score: " + GD.totalscore);
    }
}

function startLevel(lvl)
{
    var starArr = GD.ld['level'+lvl];
    starsCollected = false;
    GD.score = 0;
    GD.scoreText.setText("Score: " + GD.score);
    GD.totalscoreText.setText("Score: " + GD.totalscore);
    GD.levelText.setText("Level " + GD.level);
    makeStarSprites(starArr);

}

function reset(){

    startLevel(GD.level);
    GD.running = false;
    GD.curveBuff.clear();

}

