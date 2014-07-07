// Creates a new 'main' state that wil contain the game
var mainState = {

    preload: function() {
		// Function called first to load all the assets
        game.load.image('player', 'assets/player.png');
        game.load.image('wallV', 'assets/wallVertical.png');
        game.load.image('wallH', 'assets/wallHorizontal.png');
        game.load.image('coin', 'assets/coin.png');
        game.load.image('enemy', 'assets/enemy.png');
    },

    create: function() {
    	// Fuction called after 'preload' to setup the game
        game.stage.backgroundColor = "#3498db";
        game.physics.startSystem(Phaser.Physics.ARCADE);

        this.cursor = game.input.keyboard.createCursorKeys();

        this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        this.player.anchor.setTo(.5, .5);
        game.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 500;

        this.coin = game.add.sprite(60, 140, 'coin');
        game.physics.arcade.enable(this.coin);
        this.coin.anchor.setTo(.5, .5);

        this.scoreLabel = game.add.text(30, 30, 'Score : 0', {font: '18px Arial', fill: '#ffffff'});
        this.score = 0;

        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.createMultiple(10, 'enemy');
        game.time.events.loop(2200, this.addEnemy, this);
    },

    update: function() {
        game.physics.arcade.collide(this.player, this.walls);
        game.physics.arcade.overlap(this.player, this.coin, this.takeCoin, null, this);
        game.physics.arcade.collide(this.enemies, this.walls);
        game.physics.arcade.overlap(this.player, this.enemies, this.playerDie, null, this);
		// Function called 60 times per second
        this.createWorld();
        this.movePlayer();

        if(!this.player.inWorld)
            this.playerDie();
    },

    movePlayer: function() {
        //MOVE
        if(this.cursor.left.isDown)
            this.player.body.velocity.x = -200;
        else if(this.cursor.right.isDown)
            this.player.body.velocity.x = 200;
        else
            this.player.body.velocity.x = 0;

        //JUMP
        if(this.cursor.up.isDown && this.player.body.touching.down)
            this.player.body.velocity.y = -300;
    },

    createWorld: function() {
        this.walls = game.add.group();
        this.walls.enableBody = true;
        game.add.sprite(0, 0, 'wallV', 0, this.walls);
        game.add.sprite(480, 0, 'wallV', 0, this.walls);

        game.add.sprite(0, 0, 'wallH', 0, this.walls);
        game.add.sprite(300, 0, 'wallH', 0, this.walls);
        game.add.sprite(0, 320, 'wallH', 0, this.walls);
        game.add.sprite(300, 320, 'wallH', 0, this.walls);

        game.add.sprite(-100, 160, 'wallH', 0, this.walls);
        game.add.sprite(400, 160, 'wallH', 0, this.walls);

        var middleTop = game.add.sprite(100, 80, 'wallH', 0, this.walls);
        middleTop.scale.setTo(1.5, 1);
        var middleBottom = game.add.sprite(100, 240, 'wallH', 0, this.walls);
        middleBottom.scale.setTo(1.5, 1);

        this.walls.setAll('body.immovable', true);
    },

    playerDie: function() {
        game.state.start('main');
    },

    takeCoin: function(player, coin) {
        this.score += 5;
        this.scoreLabel.text = 'Score : ' + this.score;
        this.updateCoinPosition();
    },

    updateCoinPosition: function() {
        var coinPositions = [
            {x: 140, y: 60}, {x: 360, y: 60}, // Top row
            {x: 60, y: 140}, {x: 440, y: 140}, // Middle row
            {x: 130, y: 300}, {x: 370, y: 300} // Bottom row
        ];

        for(var i = 0; i < coinPositions.length; i++) {
            if(coinPositions[i].x === this.coin.x)
                coinPositions.splice(i, 1);
        }

        var newPosition = coinPositions[game.rnd.integerInRange(0, coinPositions.length - 1)];
        this.coin.reset(newPosition.x, newPosition.y);
    },

    addEnemy: function() {
        var enemy = this.enemies.getFirstDead();

        if(!enemy)
            return;

        enemy.anchor.setTo(.5, 1);
        enemy.reset(game.world.centerX, 0);
        enemy.body.gravity.y = 500;
        enemy.body.velocity.x = 100 * Phaser.Math.randomSign();
        enemy.body.bounce.x = 1;
        enemy.checkWorldBounds = true;
        enemy.outOfBoundsKill = true;
    },
};

// Initialize Phaser, and creates a 400x490px game
var game = new Phaser.Game(500, 340, Phaser.AUTO, 'gameDiv');

// Add and start the 'main' state to start the game
game.state.add('main', mainState);
game.state.start('main');
