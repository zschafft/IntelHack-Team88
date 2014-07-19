window.onload = function() {

        var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create });

        function preload () {

            //game.load.image('logo', 'phaser.png');

        }

        function create () {

            var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
            logo.anchor.setTo(0.5, 0.5);

            //button = game.add.button(x='400',y='400', callback=Click_Button);
        
            button = game.add.button(game.world.centerX, game.world.centerY, 'button', Click_Button, this, 2, 1, 0);

    		//	Set the anchor of the sprite in the center, otherwise it would rotate around the top-left corner
    		button.anchor.setTo(0.5, 0.5);
        }

        function Click_Button(){

        	alert("Cicked on button!");

        }

    };