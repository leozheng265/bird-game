const config = {
    type: Phaser.AUTO,
    width: 900,
    height: 450,
    backgroundColor: "#5A98F4",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 500},
            debug: false
        }
    },
    scene: [scene1]
}

var game = new Phaser.Game(config);

