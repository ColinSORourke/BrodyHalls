class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
    }

    create() {
        // Menu Config
        game.Seed = -1;
    
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
        this.displaySeed = this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'No Seed Yet', menuConfig).setOrigin(0.5);

        let genSeed = this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding + 64, 'Generate Seed', menuConfig).setOrigin(0.5);
        genSeed.setInteractive();
        genSeed.on('pointerdown', () => {this.generateSeed()});


        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';
        let debugButton = this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Click to start if you have a seed', menuConfig).setOrigin(0.5);
        debugButton.setInteractive();
        debugButton.on('pointerdown', () => {this.startDebugScene()})

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
    }  

    startDebugScene(){
        if (this.displaySeed.text != 'No Seed Yet'){
            let seed = this.displaySeed.text;
            game.Maze = new Maze(seed);
            this.scene.start('debugScene');
        }
    }

    generateSeed(){
        let seed = Math.floor(Math.random() * 50515091) + 2;
            
        while (seed % 5807 == 0 || seed % 8699 == 0){
            game.seed = Math.floor(Math.random() * (game.config.mathM - 2)) + 2;
        }
        console.log(seed);
        game.Seed = seed;
        this.displaySeed.setText(seed);
    }
}