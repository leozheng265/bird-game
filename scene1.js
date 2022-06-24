class scene1 extends Phaser.Scene {
    constructor() {
        super({key: "scene1"});
        this.gameover = false;
        this.lock = 0;
        this.pillarGroup;
        this.pillarCount = 0;
        this.gameOverText;
        this.restartButton;
        this.rand = 1;
        this.score = 0;
        this.scoreLock = 0;
        this.scoreText;
        this.keyText;
    }

    preload() {
        this.load.image('player', 'assets/Agent.png');
        this.load.image('key', "assets/Key.png");
        this.load.image('pillar_top', 'assets/pillar_top.png');
        this.load.image('pillar_bot', 'assets/pillar_bot.png');
        this.load.image('ground', 'assets/Ground.png');
        this.load.image('gameover', 'assets/gameover.png');
        this.load.image('restart', 'assets/restart.png');
    }

    create() {
        this.platform = this.physics.add.staticGroup();
        this.platform.create(200, 450, 'ground').setScale(1.6).refreshBody();

        this.player = this.physics.add.image(100, 225, 'player').setScale(0.15).refreshBody();
        this.player.setCollideWorldBounds(true);

        this.input.on('pointerdown', function() {
            this.player.setVelocityY(-150);
        }, this); 
        this.key_space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.pillarGroup = this.physics.add.group();
        this.createPillar();

        this.physics.add.collider(this.player, this.pillarGroup, this.gameEnd, null, this);
        this.physics.add.collider(this.player, this.platform, this.gameEnd, null, this);

        this.gameOverText = this.add.image(450, 225, 'gameover');
        this.gameOverText.setDepth(20);
        this.gameOverText.visible = false;

        this.restartButton = this.add.image(450, 300, 'restart').setInteractive();
        this.restartButton.on('pointerdown', this.restartGame, this);
        this.restartButton.setDepth(20);
        this.restartButton.visible = false;

        this.scoreText = this.add.text(16, 16, 'Score: 0', {fontsize: '32px', fill: '#000'});
    }

    update() {
        if (this.gameover) {
            return ;
        }
        if(this.key_space.isDown && this.lock == 0) {
            this.player.setVelocityY(-150);
            this.lock = 1;
        }
        if(this.key_space.isUp) {
            this.lock = 0;
        }
        this.pillarGroup.children.iterate(function(child) {
            if(child == undefined) {
                return;
            }
            if(child.x < 0) {
                child.destroy();
            }
            else {
                child.setVelocityX(-150);
            }
            if(child.x <= 100 && this.scoreLock === 0) {
                this.scorePoint();
                this.scoreLock = 1;
            }
        }, this);
        this.pillarCount++;
        if(this.pillarCount === 200) {
            this.createPillar();
            this.pillarCount = 0;
            this.scoreLock = 0;
        }
        
    }

    createPillar() {
        if(this.gameover) {
            return ;
        }

        const pillarY = Phaser.Math.Between(-50, -30);

        if(this.rand === 1) {
            const pillarTop = this.pillarGroup.create(900, pillarY, 'pillar_top').setScale(0.5).refreshBody();
            pillarTop.body.allowGravity = false;
        }
        else {
            const pillarBot = this.pillarGroup.create(900, pillarY + 275, 'pillar_bot').setScale(0.5).refreshBody();
            pillarBot.body.allowGravity = false;
        }
        this.rand = Phaser.Math.Between(1, 2);
    }

    gameEnd() {
        this.physics.pause();
        this.gameover = true;
        this.player.setTint(0xff0000);
        this.restartButton.visible = true;
        this.gameOverText.visible = true;
    }

    restartGame() {
        this.pillarGroup.clear(true, true);
        this.player.destroy();
        this.gameOverText.visible = false;
        this.restartButton.visible = false;
        this.physics.resume();

        this.pillarCount = 0;
        this.gameover = false;

        this.player = this.physics.add.image(100, 225, 'player').setScale(0.15).refreshBody();
        this.physics.add.collider(this.player, this.pillarGroup, this.gameEnd, null, this);
        this.physics.add.collider(this.player, this.platform, this.gameEnd, null, this);
        this.player.setCollideWorldBounds(true);
    }

    scorePoint() {
        this.score++;
        this.scoreText.setText('Score: ' + this.score);
    }

}