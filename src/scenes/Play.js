class Play extends Phaser.Scene {
    constructor() {
      super("playScene");
    }
    
    preload() {
        this.load.image('Brody', './assets/transcoder.png');
        this.load.spritesheet('Rooms', './assets/RoomSheet.png', {frameWidth: 1000, frameHeight: 750});
        this.load.audio('BrodyQuest', './assets/BrodyQuestOriginal.mp3');

        this.load.image('crossroads', './assets/Crossroads.png');
        this.load.image('curvey', './assets/Curvey.png');
        this.load.image('deadend', './assets/DeadEnd.png');
        this.load.image('line', './assets/Line.png');
        this.load.image('trap', './assets/TrapRoom.png');
    }

    create() {
        this.currLoc = game.Maze.start;
        console.log(this.currLoc);
        this.viablePaths = game.Maze.dict[this.currLoc][1];
        this.spawnPoint = 0.5
        this.currScale = 1;

        

        this.background = this.add.sprite (game.config.width/2, game.config.height/2, 'Rooms').setOrigin(0.5, 0.5);
        

        this.Brody = new Brody(this, game.config.width/2, game.config.height * 1.15, 'Brody').setOrigin(this.spawnPoint, 1.1);
        this.sound.play('BrodyQuest');

        this.verticalBounds = [1, 1, 1];
        this.horizontalBounds = [this.Brody.width * 0.6, game.config.width - this.Brody.width * 0.6]

        this.pickRoom(this.currLoc);

        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(time, delta) {
      this.Brody.update(time, delta);

      if (Phaser.Input.Keyboard.JustDown(keySPACE)){
        console.log("Brody's X: " + this.Brody.x + "   CurrScale: " + this.currScale + "   ScaleBounds: " + this.verticalBounds);

      }

      if (this.currScale < 1){
        this.currScale = 1;
        this.background.setScale(this.currScale);
      }
      if (this.currScale > this.verticalBounds[1] && !this.viablePaths[0]){
        this.currScale = this.verticalBounds[1];
        this.background.setScale(this.currScale);
      }

      if(keyLEFT.isDown 
        && ((this.Brody.x >= this.Brody.width * 0.6) 
            || (this.viablePaths[3] 
                && this.currScale >= this.verticalBounds[0] 
                && this.currScale <= this.verticalBounds[1]) ) ){
        this.Brody.flipX = false;
        this.Brody.x -= this.Brody.moveSpeed;
      }
      else if (keyRIGHT.isDown 
              && ((this.Brody.x <= game.config.width - this.Brody.width * 0.6) 
                  || (this.viablePaths[2] 
                      && this.currScale >= this.verticalBounds[0] 
                      && this.currScale <= this.verticalBounds[1]) )) {
        this.Brody.flipX = true;
        this.Brody.x += this.Brody.moveSpeed;
      } 
      else if (keyUP.isDown){
        if (this.Brody.y > game.config.height * 1.15){
          this.Brody.y -= this.Brody.moveSpeed;
        } else if ((this.currScale < this.verticalBounds[1]) || ( this.viablePaths[0] && this.Brody.x > this.horizontalBounds[0] && this.Brody.x < this.horizontalBounds[1]) ) {
          this.currScale = this.currScale * 1.02;
          this.background.setScale(this.currScale);
        }
        
      } 
      else if (keyDOWN.isDown){
        if ( (this.currScale > this.verticalBounds[0]) || (this.viablePaths[1] && this.currScale > 1 && this.Brody.x > this.horizontalBounds[0] && this.Brody.x < this.horizontalBounds[1]) ){
          this.currScale = this.currScale * 50/51;
          this.background.setScale(this.currScale);
        } else if (this.viablePaths[1] && this.currScale == 1){
          this.Brody.y += 1.5 * this.Brody.moveSpeed;
        }
      }

      if (this.Brody.x <= (-this.Brody.width/2)){
        this.currLoc = game.Maze.dict[this.currLoc][0][3];
        console.log(this.currLoc);
        this.pickRoom(this.currLoc, 2);
        this.Brody.x = game.config.width;
      }
      if (this.Brody.x >= (game.config.width + this.Brody.width/2)){
        this.currLoc = game.Maze.dict[this.currLoc][0][2];
        console.log(this.currLoc);
        this.pickRoom(this.currLoc, 3);
        this.Brody.x = 0;
      }

      if (this.Brody.y >= (game.config.height * 1.15 + this.Brody.height)){
        let weirdEnd = ( game.Maze.dict[this.currLoc][1][0] && !this.viablePaths[0] )
        this.currLoc = game.Maze.dict[this.currLoc][0][1];
        console.log(this.currLoc);
        if (weirdEnd) {
          this.pickRoom(this.currLoc, 1);
        } else {
          this.pickRoom(this.currLoc, 0);
        }
        
        this.Brody.y = game.config.height * 1.15;
      }

      if (this.currScale >= this.verticalBounds[2]){
        this.currLoc = game.Maze.dict[this.currLoc][0][0];
        console.log(this.currLoc);
        this.pickRoom(this.currLoc, 1);
        this.Brody.y = game.config.height * 1.15;
      }
    }

    pickRoom(key, direction = 0){
      let pathArr = game.Maze.dict[key][1];

      let pathCount = 0;
      for (let i = 0; i < 4; i++){
        if (pathArr[i]){
          pathCount += 1;
        }
      }
      this.addIcon(pathArr, direction);

      if (pathCount == 1){
        if (pathArr[0] || pathArr[1]){
          this.background.flipX = false;
          this.background.setFrame(2);
          this.viablePaths = [false, true, false, false];
          if (pathArr[0]){
            game.Maze.dict[key][0][1] = game.Maze.dict[key][0][0]
          }
        } else if (pathArr[2]){
          this.background.flipX = true;
          this.background.setFrame(3);
          this.viablePaths = pathArr;
        } else {
          this.background.flipX = false;
          this.background.setFrame(3);
          this.viablePaths = pathArr;
        }

        this.verticalBounds = [1, 1, 2];
        this.horizontalBounds = [this.Brody.width * 0.6, game.config.width - this.Brody.width * 0.6];
        this.currScale = 1;
        this.background.setScale(this.currScale);
      }

      if (pathCount == 2){
        if (pathArr[0] && pathArr[1]){
          this.background.flipX = false;
          this.background.setFrame(0);
          this.verticalBounds = [1, 1, 4];
          this.horizontalBounds = [this.Brody.width * 0.6, game.config.width - this.Brody.width * 0.6]
          if (direction == 0){
            this.currScale = 3;
            this.background.setScale(this.currScale);
          } else {
            this.currScale = 1;
            this.background.setScale(this.currScale);
          }
        } else if (pathArr[2] && pathArr[3]){
          this.background.flipX = false;
          this.background.setFrame(1);
          this.verticalBounds = [1, 1, 2];
          this.horizontalBounds = [this.Brody.width * 0.6, game.config.width - this.Brody.width * 0.6]
          this.currScale = 1;
          this.background.setScale(this.currScale);
        } else if (pathArr[0] && pathArr[2]){
          this.background.flipX = true;
          this.background.setFrame(4);
          this.verticalBounds = [1, 1, 4];
          this.horizontalBounds = [this.Brody.width * 0.6, 675]        
          if (direction == 0){
            this.currScale = 3;
            this.background.setScale(this.currScale);
          } else {
            this.currScale = 1;
            this.background.setScale(this.currScale);
          }
        } else if (pathArr[0] && pathArr[3]){
          this.background.flipX = false;
          this.background.setFrame(4);
          this.verticalBounds = [1, 1, 4];
          this.horizontalBounds = [325, game.config.width - this.Brody.width * 0.6]
          if (direction == 0){
            this.currScale = 3;
            this.background.setScale(this.currScale);
          } else {
            this.currScale = 1;
            this.background.setScale(this.currScale);
          }
        } else if (pathArr[1] && pathArr[2]){
          this.background.flipX = true;
          this.background.setFrame(5);
          this.verticalBounds = [2.5, 3.5, 5];
          this.horizontalBounds = [this.Brody.width * 0.6, game.config.width - this.Brody.width * 0.6]
          if (direction == 2){
            this.currScale = 2.75;
            this.background.setScale(this.currScale);
          } else {
            this.currScale = 1;
            this.background.setScale(this.currScale);
          }
        } else if (pathArr[1] && pathArr[3]){
          this.background.flipX = false;
          this.background.setFrame(5);
          this.verticalBounds = [2.5, 3.5, 5];
          this.horizontalBounds = [this.Brody.width * 0.6, game.config.width - this.Brody.width * 0.6]
          if (direction == 3){
            this.currScale = 2.75;
            this.background.setScale(this.currScale);
          } else {
            this.currScale = 1;
            this.background.setScale(this.currScale);
          }
        }
        this.viablePaths = pathArr;
      }

      if (pathCount == 3){
        if (!pathArr[0]){
          this.background.flipX = false;
          this.background.setFrame(7);
          this.verticalBounds = [2.5, 3.5, 5];
          this.horizontalBounds = [this.Brody.width * 0.6, game.config.width - this.Brody.width * 0.6]
          if (direction == 1){
            this.currScale = 1;
            this.background.setScale(this.currScale);
          } else {
            this.currScale = 3;
            this.background.setScale(this.currScale);
          }
        }
        if (!pathArr[1]){
          this.background.flipX = false;
          this.background.setFrame(6);
          this.verticalBounds = [1, 1, 4];
          this.horizontalBounds = [325, 675]
          if (direction == 0){
            this.currScale = 3.5;
            this.background.setScale(this.currScale);
          } else {
            this.currScale = 1;
            this.background.setScale(this.currScale);
          }
        }
        if (!pathArr[2]){
          this.background.flipX = false;
          this.background.setFrame(8);
          this.verticalBounds = [2.5, 3.8, 6.5];
          this.horizontalBounds = [this.Brody.width * 0.6, game.config.width - this.Brody.width * 0.6]
          if (direction == 0){
            this.currScale = 6;
            this.background.setScale(this.currScale);
          } else if (direction == 3){
            this.currScale = 3;
            this.background.setScale(this.currScale);
          } else {
            this.currScale = 1;
            this.background.setScale(this.currScale);
          }
        }
        if (!pathArr[3]){
          this.background.flipX = true;
          this.background.setFrame(8);
          this.verticalBounds = [2.5, 3.8, 6.5];
          this.horizontalBounds = [this.Brody.width * 0.6, game.config.width - this.Brody.width * 0.6]
          if (direction == 0){
            this.currScale = 6;
            this.background.setScale(this.currScale);
          } else if (direction == 2){
            this.currScale = 3;
            this.background.setScale(this.currScale);
          } else {
            this.currScale = 1;
            this.background.setScale(this.currScale);
          }
        }
        this.viablePaths = pathArr;
      }

      if (pathCount == 4){
        if (direction == 0 || direction == 1){
          this.background.flipX = false;
          this.background.setFrame(0);
          this.viablePaths = [true, true, false, false];
          this.verticalBounds = [1, 1, 4];
          this.horizontalBounds = [this.Brody.width * 0.6, game.config.width - this.Brody.width * 0.6]
          console.log(direction);
          if (direction == 0){
            this.currScale = 3;
            this.background.setScale(this.currScale);
          } else {
            this.currScale = 1;
            this.background.setScale(this.currScale);
          }
        } else {
          this.background.flipX = false;
          this.background.setFrame(1);
          this.viablePaths = [false, false, true, true];
          this.verticalBounds = [1, 1, 2];
          this.horizontalBounds = [this.Brody.width * 0.6, game.config.width - this.Brody.width * 0.6]
          this.currScale = 1;
          this.background.setScale(this.currScale);
        }
      }
    }

    addIcon(paths, direction = 0){
      let numPath = 0;
      for (let i = 0; i < 4; i++){
        if (paths[i]){
          numPath += 1;
        }
      }

      if (numPath == 4){
        let spot = this.add.sprite(32, 32, 'line').setOrigin(0.5,0.5);
        spot.setScale(0.5);
        if (direction == 2 || direction == 3){
          spot.angle = 90;
        }
      }
      if (numPath == 3){
          let first = paths.indexOf(false);
          let rotation = [90, 270, 180, 0];
          let spot = this.add.sprite(32, 32, 'crossroads').setOrigin(0.5,0.5);
          spot.setScale(0.5);
          spot.angle = rotation[first];
      }
      if (numPath == 1){
          let rotation = [0, 180, 90, 270];
          let spot = this.add.sprite(32, 32, 'deadend').setOrigin(0.5,0.5);
          spot.setScale(0.5);
          spot.angle = rotation[direction];
      }
      if (numPath == 2){
          let first = paths.indexOf(true);
          if (paths[first+1] && first != 1){
              let spot = this.add.sprite(32, 32, 'line').setOrigin(0.5,0.5);
              spot.setScale(0.5);
              if (first == 2){
                  spot.angle = 90;
              }
          } else {
              let spot = this.add.sprite(32, 32, 'curvey').setOrigin(0.5,0.5);
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