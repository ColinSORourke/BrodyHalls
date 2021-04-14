class Debug extends Phaser.Scene {
    constructor() {
        super("debugScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('crossroads', './assets/Crossroads.png');
        this.load.image('curvey', './assets/Curvey.png');
        this.load.image('deadend', './assets/DeadEnd.png');
        this.load.image('fourway', './assets/FourWay.png');
        this.load.image('line', './assets/Line.png');
        this.load.image('trap', './assets/TrapRoom.png');

    }

    create() {
        console.log(game.Maze);
        console.log(game.Maze['dict']['1,1'][1]);

        let topArray = [0xFFFFFF, 0xAAC0AA, 0x736372, 0xA18276, 0x7A918D, 0xE1D89F, 0xCD8B76, 0x7D387D, 0x27474E, 0xFFFFFF];
        let topArrayMod = [0xFFFFFF, 0xE1D89F, 0xCD8B76, 0x7D387D, 0x27474E, 0xAAC0AA, 0x736372, 0xA18276, 0x7A918D, 0xFFFFFF];
        let sideArray = [0xFFFFFF, 0x59C9A5, 0xD81E5B, 0x23395B, 0xFFFD98, 0x17301C, 0x379392, 0x4F86C6, 0x744FC6, 0xFFFFFF];
        let sideArrayMod = [0xFFFFFF, 0x17301C, 0x379392, 0x4F86C6, 0x744FC6, 0x59C9A5, 0xD81E5B, 0x23395B, 0xFFFD98, 0xFFFFFF];

        for (var i = 0; i<=9; i++){
            this.add.rectangle(iconUnit * i, 0, iconUnit, iconUnit, topArray[i]).setOrigin(0,0);
            this.add.rectangle(0, iconUnit * i, iconUnit, iconUnit, sideArray[i]).setOrigin(0,0);
            this.add.rectangle(iconUnit * i, iconUnit * 9, iconUnit, iconUnit, topArrayMod[i]).setOrigin(0,0);
            this.add.rectangle(iconUnit * 9, iconUnit * i, iconUnit, iconUnit, sideArrayMod[i]).setOrigin(0,0);
        }

        for (i = 1; i<=8; i++){
            for(var j = 1; j<=8; j++){
                let key = i + ',' + j;
                let numPath = 0;
                let paths = game.Maze['dict'][key][1]
                paths.forEach(element => {
                    if (element){
                        numPath += 1;
                    }
                });
                if (numPath == 4){
                    let spot = this.add.sprite(iconUnit * i+32, iconUnit*j+32, 'fourway').setOrigin(0.5,0.5);
                    spot.setScale(0.5);
                }
                if (numPath == 3){
                    let first = paths.indexOf(false);
                    let rotation = [90, 270, 180, 0];
                    let spot = this.add.sprite(iconUnit * i+32, iconUnit*j+32, 'crossroads').setOrigin(0.5,0.5);
                    spot.setScale(0.5);
                    spot.angle = rotation[first];
                }
                if (numPath == 1){
                    let first = paths.indexOf(true);
                    let rotation = [0, 180, 90, 270];
                    let spot = this.add.sprite(iconUnit * i+32, iconUnit*j+32, 'deadend').setOrigin(0.5,0.5);
                    spot.setScale(0.5);
                    spot.angle = rotation[first];
                }
                if (numPath == 2){
                    let first = paths.indexOf(true);
                    if (paths[first+1] && first != 1){
                        let spot = this.add.sprite(iconUnit * i + 32, iconUnit*j + 32, 'line').setOrigin(0.5,0.5);
                        spot.setScale(0.5);
                        if (first == 2){
                            spot.angle = 90;
                        }
                    } else {
                        let spot = this.add.sprite(iconUnit * i + 32, iconUnit*j + 32, 'curvey').setOrigin(0.5,0.5);
                        spot.setScale(0.5);
                        if (paths[1] && paths[2]){
                            spot.angle = 90;
                        }
                        if (paths[1] && paths[3]){
                            spot.angle = 180;
                        }
                        if (paths[0] && paths[3]){
                            spot.angle = 270;
                        }
                    }
                }
            }
        }
    }

}