class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
    }

    create() {
        // Menu Config
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            alighn: 'right',
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 0
        }

        // CREATE MENU... JESUS WEPT
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'MAZE HAHAHA', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000',
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Press Space to start.', menuConfig).setOrigin(0.5);

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            // easy mode
            let seed = Math.floor(Math.random() * 50515091) + 2;
            
            while (seed % 5807 == 0 || seed % 8699 == 0){
                seed = Math.floor(Math.random() * (game.config.mathM - 2)) + 2;
            } 

            console.log(seed);
            this.Maze = new Maze(seed);
        }
    }
}