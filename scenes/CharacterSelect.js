// scenes/CharacterSelect.js
class CharacterSelect extends Phaser.Scene {
    constructor() {
        super('CharacterSelect');
        this.selectedCharacter = null;
    }

    // preload() {
    //     // Загрузка ассетов
    //     this.load.spritesheet('character1', 'assets/character1.png', { 
    //         frameWidth: 32, 
    //         frameHeight: 48 
    //     });
    //     this.load.spritesheet('character2', 'assets/character2.png', { 
    //         frameWidth: 32, 
    //         frameHeight: 48 
    //     });
    // }

    create() {
        // Заголовок
        this.add.text(400, 100, 'Select Your Character', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

        // Создание персонажей для выбора
        const character1 = this.add.rectangle(300, 300, 32, 48, 0xff0000).setInteractive();
        const character2 = this.add.rectangle(500, 300, 32, 48, 0x00ff00).setInteractive();

        // Обработка выбора персонажа
        character1.on('pointerdown', () => this.selectCharacter('character1'));
        character2.on('pointerdown', () => this.selectCharacter('character2'));

        // Кнопка Play
        const playButton = this.add.text(400, 500, 'Play', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#333',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive();

        playButton.on('pointerdown', () => {
            if (this.selectedCharacter) {
                this.scene.start('MainGame', { character: this.selectedCharacter });
            }
        });
    }

    selectCharacter(characterId) {
        this.selectedCharacter = characterId;
        // Сброс тинта для всех спрайтов
        const sprites = this.add.displayList.list.filter(item => item.type === 'Sprite');
        sprites.forEach(sprite => {
            sprite.setTint(0xffffff);
        });
        // Подсветка выбранного персонажа
        sprites.find(sprite => sprite.texture.key === characterId)?.setTint(0x00ff00);
    }
}
