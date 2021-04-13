let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu],
    // Pseudorandom Important Values
    mathM: 50515093,
    mathP: 5807,
    mathQ: 8699
  }

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard vars
let keyUP, keyDOWN, keyLEFT, keyRIGHT, keySPACE;