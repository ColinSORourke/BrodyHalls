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
            fontSize: '56px',
            backgroundColor: '#998888',
            color: '#690375',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5
            },
            fixedWidth: 0
        }

        /* backgroundColor: '#F3B141',
            color: '#843605', */

        this.title = this.add.text(game.config.width/2, game.config.height/2 - borderUISize*3 - borderPadding*3, 'BrodyHalls', menuConfig).setOrigin(0.5);

        menuConfig.fontSize = '28px';

        // CREATE MENU... JESUS WEPT        
        this.displaySeed = this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding, 'No Seed Yet', menuConfig).setOrigin(0.5);
        // 16726498
        // 32957304
        this.currSeed = "";

        key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
        key0 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ZERO);
        key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
        key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);
        key4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FOUR);
        key5 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.FIVE);
        key6 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SIX);
        key7 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SEVEN);
        key8 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.EIGHT);
        key9 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NINE);
        keyDEL = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE);

        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';

        let genSeed = this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding + 64, 'Generate Seed', menuConfig).setOrigin(0.5);
        genSeed.setInteractive();
        genSeed.on('pointerdown', () => {this.generateSeed()});

        this.add.text(game.config.width/2 + 256,  game.config.height/2 - borderUISize - borderPadding + 64, 'Or type one with numbers \n (delete to erase)').setOrigin(0.5);
        
        let playButton = this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding, 'Click to start if you have a seed', menuConfig).setOrigin(0.5);
        playButton.setInteractive();
        playButton.on('pointerdown', () => {this.startPlayScene()})

        let debugButton = this.add.text(game.config.width/2, game.config.height/2 + (borderUISize + borderPadding)*2, 'Click to view Debug Map (cheating)', menuConfig).setOrigin(0.5);
        debugButton.setInteractive();
        debugButton.on('pointerdown', () => {this.startDebugScene()})

        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(key0) && this.currSeed.length >= 1 && this.currSeed.length < 8){
            this.currSeed += "0";
            this.displaySeed.text = this.currSeed;
        }
        if (Phaser.Input.Keyboard.JustDown(key1) && this.currSeed.length < 8){
            this.currSeed += "1";
            this.displaySeed.text = this.currSeed;
        }
        if (Phaser.Input.Keyboard.JustDown(key2) && this.currSeed.length < 8){
            this.currSeed += "2";
            this.displaySeed.text = this.currSeed;
        }
        if (Phaser.Input.Keyboard.JustDown(key3) && this.currSeed.length < 8){
            this.currSeed += "3";
            this.displaySeed.text = this.currSeed;
        }
        if (Phaser.Input.Keyboard.JustDown(key4) && this.currSeed.length < 8){
            this.currSeed += "4";
            this.displaySeed.text = this.currSeed;
        }
        if (Phaser.Input.Keyboard.JustDown(key5) && this.currSeed.length < 8){
            this.currSeed += "5";
            this.displaySeed.text = this.currSeed;
        }
        if (Phaser.Input.Keyboard.JustDown(key6) && this.currSeed.length < 8){
            this.currSeed += "6";
            this.displaySeed.text = this.currSeed;
        }
        if (Phaser.Input.Keyboard.JustDown(key7) && this.currSeed.length < 8){
            this.currSeed += "7";
            this.displaySeed.text = this.currSeed;
        }
        if (Phaser.Input.Keyboard.JustDown(key8) && this.currSeed.length < 8){
            this.currSeed += "8";
            this.displaySeed.text = this.currSeed;
        }
        if (Phaser.Input.Keyboard.JustDown(key9) && this.currSeed.length < 8){
            this.currSeed += "9";
            this.displaySeed.text = this.currSeed;
        }
        if (Phaser.Input.Keyboard.JustDown(keyDEL)){
            this.currSeed = "";
            this.displaySeed.text = "No Seed Yet";
        }
    }  

    startDebugScene(){
        // this.generateData();
        if (this.displaySeed.text != 'No Seed Yet'){
            let seed = this.displaySeed.text;
            game.Seed = seed;
            game.Maze = new Maze(seed);
            console.log(game.Maze.data);
            this.scene.start('debugScene');
        }
    }

    startPlayScene(){
        // this.generateData();
        if (this.displaySeed.text != 'No Seed Yet'){
            let seed = this.displaySeed.text;
            game.Seed = seed;
            game.Maze = new Maze(seed);
            console.log(game.Maze.data);
            this.scene.start('playScene');
        }
    }

    // Debug function tht generate 200 maps and reports some data about said maps.
    generateData(){
        this.add.rectangle(game.config.width/2 - 120, game.config.height - 240, 240, 240, 0xF5F5DC).setOrigin(0,0);
        this.add.rectangle(game.config.width/2, game.config.height - 240, 3, 240, 0x58BC82).setOrigin(0,0);
        this.add.rectangle(game.config.width/2 + 60, game.config.height - 240, 3, 240, 0x58BC82).setOrigin(0,0);

        let compsDict = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0};
        let averageEnds = 0;
        let averageBlank = 0;
        for (var i = 0; i<= 200; i++){
            let seed = this.generateSeed();

            console.log(seed);

            let colors = [0xD0CFEC, 0x645986, 0x801A86, 0x4E0250, 0x000000];

            game.Maze = new Maze(seed);

            console.log(game.Maze.data[2]);

            
            compsDict[game.Maze.data[2]] += 1;

            averageEnds += game.Maze.data[4];
            averageBlank += game.Maze.data[5];

            let x = game.Maze.data[1] - 64;
            let y = game.Maze.data[2];
            this.add.rectangle(game.config.width/2 - 120 + x * 10, game.config.height - y*20, 8, 8, colors[game.Maze.data[3]/2]);
        }

        averageEnds = averageEnds / 200.0;
        averageBlank = averageBlank / 200.0;



        console.log(compsDict);
        console.log("Average Ends: " + averageEnds);
        console.log("Average Blanks: " + averageBlank);
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