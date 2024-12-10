// scenes/MainGame.js
class MainGame extends Phaser.Scene {
    constructor() {
        super('MainGame');
        this.player = null;
        this.pressIndicator = null;
        this.interactiveObject = null;
    }

    // preload() {
    //     // Загрузка карты и тайлов
    //     this.load.image('tiles', 'assets/tiles.png');
    //     this.load.tilemapTiledJSON('map', 'assets/map.json');
    // }

    create(data) {
        // Отключаем гравитацию
        this.matter.world.setGravity(0, 0);

        // Создание карты большего размера чем экран (1600x1200)
        this.add.rectangle(800, 600, 1600, 1200, 0x333333);

        // Создание физических границ карты
        this.matter.world.setBounds(0, 0, 1600, 1200);

        // Создание игрока с выбранным спрайтом
        this.player = this.matter.add.sprite(400, 300, data.character);
        
        // Настройка камеры
        this.cameras.main.setBounds(0, 0, 1600, 1200);
        this.cameras.main.startFollow(this.player);

        // Создание интерактивного объекта
        this.interactiveObject = this.add.sprite(800, 600, 'interactive');

        // Создание индикатора "Press"
        this.pressIndicator = this.add.text(0, 0, 'Press X', {
            fontSize: '16px',
            fill: '#fff'
        });
        this.pressIndicator.setVisible(false);

        // Настройка управления
        this.keys = this.input.keyboard.addKeys({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D',
            interact: 'X'
        });

        // Создание анимаций движения
        this.createPlayerAnimations();
    }

    update() {
        // Управление движением игрока
        this.handlePlayerMovement();
        
        // Проверка близости к интерактивному объекту
        this.checkInteraction();
        
        // Обновление позиции индикатора над игроком
        if (this.pressIndicator.visible) {
            this.pressIndicator.setPosition(
                this.player.x - 20,
                this.player.y - 50
            );
        }
    }

    handlePlayerMovement() {
        const speed = 3;
        let velocityX = 0;
        let velocityY = 0;

        if (this.keys.left.isDown) {
            velocityX = -speed;
            this.player.play('walk-left', true);
        }
        else if (this.keys.right.isDown) {
            velocityX = speed;
            this.player.play('walk-right', true);
        }

        if (this.keys.up.isDown) {
            velocityY = -speed;
            this.player.play('walk-up', true);
        }
        else if (this.keys.down.isDown) {
            velocityY = speed;
            this.player.play('walk-down', true);
        }

        if (velocityX === 0 && velocityY === 0) {
            this.player.stop(); // остановка анимации при отсутствии движения
        }

        this.player.setVelocity(velocityX, velocityY);
    }

    checkInteraction() {
        const distance = Phaser.Math.Distance.Between(
            this.player.x,
            this.player.y,
            this.interactiveObject.x,
            this.interactiveObject.y
        );

        if (distance < 100) {
            this.pressIndicator.setVisible(true);
            if (this.keys.interact.isDown) {
                this.scene.start('FallingRocks');
            }
        } else {
            this.pressIndicator.setVisible(false);
        }
    }

    createPlayerAnimations() {
        // Создание анимаций движения для персонажа
        // Здесь нужно добавить создание анимаций на основе спрайтшита
    }
}
