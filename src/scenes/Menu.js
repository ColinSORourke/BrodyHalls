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
        this.displaySeed = this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, '11071580', menuConfig).setOrigin(0.5);

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
        // this.generateData();


        if (this.displaySeed.text != 'No Seed Yet'){
            let seed = this.displaySeed.text;
            game.Maze = new Maze(seed);
            console.log(game.Maze.data);
            this.scene.start('debugScene');
        }
    }

    // Debug function tht generate 200 maps and reports some data about said maps.
    generateData(){
        this.add.rectangle(game.config.width/2 - 120, game.config.height - 240, 240, 240, 0xF5F5DC).setOrigin(0,0);
        this.add.rectangle(game.config.width/2, game.config.height - 240, 3, 240, 0x58BC82).setOrigin(0,0);
        this.add.rectangle(game.config.width/2 + 60, game.config.height - 240, 3, 240, 0x58BC82).setOrigin(0,0);

        let compsDict = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0};
        for (var i = 0; i<= 200; i++){
            let seed = this.generateSeed();

            console.log(seed);

            let colors = [0xD0CFEC, 0x645986, 0x801A86, 0x4E0250, 0x000000];

            game.Maze = new Maze(seed);

            
            compsDict[game.Maze.data[2]] += 1;

            let x = game.Maze.data[1] - 64;
            let y = game.Maze.data[2];
            this.add.rectangle(game.config.width/2 - 120 + x * 10, game.config.height - y*20, 8, 8, colors[game.Maze.data[3]/2]);
        }
        console.log(compsDict);
    }

    // Generates a random seed for Blum Blum Shub
    generateSeed(){
        let seed = Math.floor(Math.random() * 50515091) + 2;
            
        while (seed % 5807 == 0 || seed % 8699 == 0){
            seed = Math.floor(Math.random() * (game.config.mathM - 2)) + 2;
        }
        //console.log(seed);
        game.Seed = seed;
        this.displaySeed.setText(seed);
        return seed;
    }
}