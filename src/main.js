let config = {
    type: Phaser.CANVAS,
    width: 1000,
    height: 750,
    scene: [Menu, Debug, Play],
    // Pseudorandom Important Values
    mathM: 50515093,
    mathP: 5807,
    mathQ: 8699
  }

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
let iconUnit = 64;

// reserve keyboard vars
let keyUP, keyDOWN, keyLEFT, keyRIGHT, keySPACE;