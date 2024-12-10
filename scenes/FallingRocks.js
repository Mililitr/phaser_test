// scenes/FallingRocks.js
class FallingRocks extends Phaser.Scene {
    constructor() {
        super('FallingRocks');
        this.init();
    }

    init() {
        this.player = null;
        this.lives = 3;
        this.timeLeft = 60;
        this.gameOver = false;
        this.rocks = [];
        this.score = 0;
        this.level = 1;
        this.powerups = [];
    }

    // preload() {
    //     this.load.image('rock', 'assets/rock.png');
    //     this.load.image('heart', 'assets/heart.png');
    // }

    create() {
        // Создание физических границ
        this.matter.world.setBounds(0, 0, 800, 600);
        
        // Включаем гравитацию
        this.matter.world.setGravity(0, 1); // Устанавливаем гравитацию по оси Y
        
        // Создание игрока
        this.player = this.matter.add.sprite(400, 500, 'player');
        
        // UI элементы
        this.livesText = this.add.text(16, 16, `Lives: ${this.lives}`, { fontSize: '32px', fill: '#fff' });
        this.timerText = this.add.text(16, 56, `Time: ${this.timeLeft}`, { fontSize: '32px', fill: '#fff' });
        
        // Кнопка рестарта (изначально невидимая)
        this.restartButton = this.add.text(400, 300, 'Restart', {
            fontSize: '32px',
            fill: '#fff',
            backgroundColor: '#333',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive()
        .setVisible(false);
        
        this.restartButton.on('pointerdown', () => {
            this.scene.restart();
        });

        // Управление
        this.keys = this.input.keyboard.addKeys({
            left: 'A',
            right: 'D'
        });

        // Таймер для спавна камней
        this.time.addEvent({
            delay: 1000,
            callback: this.spawnRock,
            callbackScope: this,
            loop: true
        });

        // Главный таймер игры
        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

        this.matter.world.on('collisionstart', (event) => {
        const pairs = event.pairs;
        pairs.forEach(pair => {
            const rockBody = this.rocks.find(rock => 
                rock.body === pair.bodyA || rock.body === pair.bodyB
            );
            if (rockBody && (pair.bodyA === this.player.body || pair.bodyB === this.player.body)) {
                this.playerHit();
                rockBody.destroy();
            }
        });
    });

    // Добавляем текст счета
    this.scoreText = this.add.text(16, 96, `Score: ${this.score}`, { fontSize: '32px', fill: '#fff' });
    this.levelText = this.add.text(16, 136, `Level: ${this.level}`, { fontSize: '32px', fill: '#fff' });

    // Таймер для спавна бонусов
    this.time.addEvent({
        delay: 5000,
        callback: this.spawnPowerup,
        callbackScope: this,
        loop: true
    });

    // Увеличиваем сложность каждые 20 секунд
    this.time.addEvent({
        delay: 20000,
        callback: this.increaseDifficulty,
        callbackScope: this,
        loop: true
    });

    }

    update() {
        if (this.gameOver) return;

        // Управление игроком
        const speed = 5;
        if (this.keys.left.isDown) {
            this.player.setVelocityX(-speed);
        } else if (this.keys.right.isDown) {
            this.player.setVelocityX(speed);
        } else {
            this.player.setVelocityX(0);
        }

        this.powerups.forEach((powerup, index) => {
            if (Phaser.Geom.Intersects.RectangleToRectangle(
                this.player.getBounds(),
                powerup.getBounds()
            )) {
                this.collectPowerup(powerup);
                this.powerups.splice(index, 1);
            }
        });
    }

    spawnRock() {
        if (this.gameOver) return;
        const x = Phaser.Math.Between(50, 750);
        const rock = this.matter.add.sprite(x, 0, 'rock');
        
        // Случайный размер камней
        const scale = Phaser.Math.FloatBetween(0.5, 1.5);
        rock.setScale(scale);
        
        // Настраиваем физическое тело камня
        rock.setFrictionAir(0.001); // Минимальное сопротивление воздуха
        rock.setBounce(0.4);        // Небольшой отскок при столкновении
        
        // Добавляем вращение
        rock.setAngularVelocity(Phaser.Math.FloatBetween(-0.05, 0.05));
        
        this.rocks.push(rock);
    }

    spawnPowerup() {
        if (this.gameOver) return;
        const x = Phaser.Math.Between(50, 750);
        const powerupType = Phaser.Math.Between(1, 3);
        const powerup = this.matter.add.sprite(x, 0, 'powerup');
        
        // Разные типы бонусов
        switch(powerupType) {
            case 1: // Щит
                powerup.setTint(0x00ff00);
                powerup.powerupType = 'shield';
                break;
            case 2: // Замедление времени
                powerup.setTint(0x0000ff);
                powerup.powerupType = 'slowtime';
                break;
            case 3: // Дополнительная жизнь
                powerup.setTint(0xff0000);
                powerup.powerupType = 'extralife';
                break;
        }
        
        powerup.setVelocityY(2);
        this.powerups.push(powerup);
    }

    collectPowerup(powerup) {
        switch(powerup.powerupType) {
            case 'shield':
                this.activateShield(5000); // Щит на 5 секунд
                break;
            case 'slowtime':
                this.slowDownRocks(5000); // Замедление на 5 секунд
                break;
            case 'extralife':
                this.lives++;
                this.livesText.setText(`Lives: ${this.lives}`);
                break;
        }
        this.score += 50;
        this.scoreText.setText(`Score: ${this.score}`);
        powerup.destroy();
    }

    activateShield(duration) {
        this.player.setTint(0x00ff00); // Зеленое свечение для щита
        this.player.isShielded = true;
        
        this.time.delayedCall(duration, () => {
            this.player.clearTint();
            this.player.isShielded = false;
        });
    }

    slowDownRocks(duration) {
        // Filter out destroyed rocks and slow down existing ones
        this.rocks = this.rocks.filter(rock => rock.body !== undefined);
        this.rocks.forEach(rock => {
            const currentVelocity = rock.body.velocity;
            rock.setVelocity(currentVelocity.x * 0.5, currentVelocity.y * 0.5);
        });
        
        this.time.delayedCall(duration, () => {
            // Filter again before restoring speed
            this.rocks = this.rocks.filter(rock => rock.body !== undefined);
            this.rocks.forEach(rock => {
                const currentVelocity = rock.body.velocity;
                rock.setVelocity(currentVelocity.x * 2, currentVelocity.y * 2);
            });
        });
    }
    increaseDifficulty() {
        if (this.gameOver) return;
        this.level++;
        this.levelText.setText(`Level: ${this.level}`);
    }


    playerHit() {
        this.lives--;
        this.livesText.setText(`Lives: ${this.lives}`);
        
        if (this.lives <= 0) {
            this.gameOver = true;
            // Удалим уничтоженные камни из массива перед вызовом showGameOver
            this.rocks = this.rocks.filter(rock => rock.body !== undefined);
            this.showGameOver(false);
        }
    }

    updateTimer() {
        if (this.gameOver) return;
        
        this.timeLeft--;
        this.timerText.setText(`Time: ${this.timeLeft}`);
        
        if (this.timeLeft <= 0) {
            this.gameOver = true;
            this.showGameOver(true);
        }
    }

    showGameOver(won) {
        const message = won ? 'Победа!' : 'Поражение';
        this.add.text(400, 200, message, {
            fontSize: '64px',
            fill: '#fff'
        }).setOrigin(0.5);
        
        this.restartButton.setVisible(true);
        
        // Остановка только существующих камней
        this.rocks.forEach(rock => {
            if (rock.body) {  // Проверяем, существует ли еще тело объекта
                rock.setVelocity(0, 0);
            }
        });
    }
}