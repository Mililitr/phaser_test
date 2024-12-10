const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game',
    physics: {
        default: 'matter',
        matter: {
            debug: true,
            gravity: { y: 1 }  // Меняем с 0 на 1 для включения гравитации
        }
    },
    scene: [CharacterSelect, MainGame, FallingRocks]
};

const game = new Phaser.Game(config);
