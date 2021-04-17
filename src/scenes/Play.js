class Play extends Phaser.Scene {
    constructor() {
      super("playScene");
    }
    
    preload() {
        this.load.image('Brody', './assets/transcoder.png');
        this.load.audio('BrodyQuest', './assets/BrodyQuestOriginal.mp3');
    }

    create() {
        this.Brody = new Brody(this, game.config.width/2, game.config.height * 1.1, 'Brody').setOrigin(0.5, 1.1);
        //this.sound.play('BrodyQuest');

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    }

    update(time, delta) {
      this.Brody.update(time, delta);
    }
}