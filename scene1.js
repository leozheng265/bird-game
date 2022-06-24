class scene1 extends Phaser.Scene {
    constructor() {
        super({key: "scene1"});
        this.gameover = false;
        this.lock = 0;
        this.pillarGroup;
        this.gapsGroup;
        this.pillarCount = 0;
    }

    preload() {
        this.load.image('player', 'assets/Agent.png');
        this.load.image('key', "assets/Key.png");
        this.load.image('pillar_top', 'assets/pillar_top.png');
        this.load.image('pillar_bot', 'assets/pillar_bot.png');
        this.load.image('ground', 'assets/Ground.png');
    }

    /*
     * Create game objects. 
     */
    create() {
        this.platform = this.physics.add.staticGroup();
        this.platform.create(200, 450, 'ground').setScale(1.6).refreshBody();

        this.player = this.physics.add.image(100, 225, 'player').setScale(0.2).refreshBody();
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.platform);

        this.input.on('pointerdown', function() {
            this.player.setVelocityY(-150);
        }, this); 
        this.key_space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.pillarGroup = this.physics.add.group();
        this.gapsGroup = this.physics.add.group();
        this.createPillar();
    }

    update() {
        if (this.gameover == true) {
            return ;
        }
        if(this.player.body.touching.down) {
            this.gameover = false;
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
                child.setVelocityX(-100);
            }
        });
        this.gapsGroup.children.iterate(function(child) {
            child.body.setVelocityX(-100);
        });
        this.pillarCount++;
        if(this.pillarCount === 250) {
            this.createPillar();
            this.pillarCount = 0;
        }
    }

    createPillar() {
        if(this.gameover) {
            return ;
        }

        const pillarY = Phaser.Math.Between(-50, -30);
        const rand = Phaser.Math.Between(1, 2);

        console.log(pillarY);
        const gap = this.add.line(900, pillarY + 50, 0, 0, 0, 98);
        this.gapsGroup.add(gap);
        gap.body.allowGravity = false;
        gap.visible = false;

        if(rand === 1) {
            const pillarTop = this.pillarGroup.create(900, pillarY, 'pillar_top').setScale(0.5).refreshBody();
            pillarTop.body.allowGravity = false;
        }
        else {
            const pillarBot = this.pillarGroup.create(900, pillarY + 275, 'pillar_bot').setScale(0.5).refreshBody();
            pillarBot.body.allowGravity = false;
        }



    }
}