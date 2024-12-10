// scenes/CharacterSelect.js
class CharacterSelect extends Phaser.Scene {
    constructor() {
        super('CharacterSelect');
        this.selectedCharacter = null;
        this.playButton = null;
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
        this.add.text(400, 100, 'Select Your Character', {
            fontSize: '32px',
            fill: '#fff'
        }).setOrigin(0.5);

        const character1 = this.add.rectangle(300, 300, 32, 48, 0xff0000)
            .setInteractive()
            .setAlpha(0.6);
        const character2 = this.add.rectangle(500, 300, 32, 48, 0x00ff00)
            .setInteractive()
            .setAlpha(0.6);

        character1.on('pointerdown', () => this.selectCharacter('character1', character1, character2));
        character2.on('pointerdown', () => this.selectCharacter('character2', character2, character1));

        this.playButton = this.add.text(400, 500, 'Play', {
            fontSize: '24px',
            fill: '#fff',
            backgroundColor: '#333',
            padding: { x: 20, y: 10 }
        })
        .setOrigin(0.5)
        .setInteractive()
        .setAlpha(0.5); // Затемняем кнопку по умолчанию

        this.playButton.on('pointerdown', () => {
            if (this.selectedCharacter) {
                this.scene.start('MainGame', { character: this.selectedCharacter });
            }
        });
    }

    selectCharacter(characterId, selectedRect, otherRect) {
        this.selectedCharacter = characterId;
        
        // Подсвечиваем выбранный персонаж и затемняем другой
        selectedRect.setAlpha(1);
        otherRect.setAlpha(0.6);
        
        // Активируем кнопку Play
        this.playButton.setAlpha(1);
    }

}
