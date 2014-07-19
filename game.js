GD = {};

function MathGame() {

        var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

        function preload () {

            game.load.image('logo', 'phaser.png');

        }

        function create () {

            // var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
            // logo.anchor.setTo(0.5, 0.5);

            
            GD.player=game.add.sprite(0,0,'delorean');
            GD.fun='';
            GD.running=false;

        }

        function update() {
        	//update loop
        }

};

window.onload = MathGame;