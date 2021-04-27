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
        this.load.image('Starfish', './assets/Starfish.png');
        this.load.image('StarLoc', './assets/StarLoc.png');

        this.load.image('Space', './assets/space-safari-background.png');
    }

    create() {
        this.textConfig = {
          fontFamily: 'Courier',
          fontSize: '28px',
          backgroundColor: '#998888',
          color: '#690375',
          align: 'right',
          padding: {
            top: 5,
            bottom: 5
          },
          fixedWidth: 0
        }

        this.music = this.sound.add('BrodyQuest');
        this.musicConfig =  {
          mute: false,
          volume: 0.75,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: false,
          delay: 0
        };
        this.queuedTransition = ['veryStart'];
        this.currLoop = 'pianoLoop';
        this.markBQ();
        this.score = 0;
        audioController(this, this.music);

        this.currLoc = game.Maze.start;
        console.log(this.currLoc);
        this.viablePaths = game.Maze.dict[this.currLoc][1];
        this.spawnPoint = 0.5
        this.currScale = 1;

        this.spaceBackground = this.add.tileSprite(0, 0, 1440, 2880, 'Space').setOrigin(0, 0);
        this.spaceSpeed = 4;
        this.spaceBackground.visible = false;
        this.background = this.add.sprite(game.config.width/2, game.config.height/2, 'Rooms').setOrigin(0.5, 0.5);

        this.gameWon = false;

        // Red, Blue, Green, Yellow, Purple
        this.filled = [false, false, false, false, false];

        this.following = this.add.sprite(game.config.width/2, game.config.height, 'Starfish').setOrigin(0.5, 0);
        this.following.bounce = 0;
        this.following.visible = false;
        this.followingBool = false;

       
        //this.inRoom.visible = false;

        this.dropOff = this.add.sprite(game.config.width/2, 0, 'StarLoc').setOrigin(0.5, 0);
        this.filledStar = this.add.sprite(game.config.width/2, 0, 'Starfish').setOrigin(0.5, 0);

        this.Brody = new Brody(this, game.config.width/2, game.config.height * 1.15, 'Brody').setOrigin(this.spawnPoint, 1.1);
        //this.sound.play('BrodyQuest');

        this.verticalBounds = [1, 1, 1];
        this.horizontalBounds = [this.Brody.width * 0.6, game.config.width - this.Brody.width * 0.6]

        this.inRoom = this.add.sprite(game.config.width/2, game.config.height, 'Starfish').setOrigin(0.5, 0.5);
        this.inRoom.bounce = 0;

        this.pickRoom(this.currLoc);

        this.returnTimer = 0;
        this.returnText = this.add.text(game.config.width/2, game.config.height/2, 'Keep holding to return to Menu', this.textConfig).setOrigin(0.5);
        this.returnText.visible = false;

        
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyM = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
        keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    }

    update(time, delta) {
      if (this.filled[0] && this.filled[1] && this.filled[2] && this.filled[3] && this.filled[4] && !this.gameWon){
          this.gameWon = true;
          this.verticalBounds = [1, 1, 1];
          this.horizontalBounds = [this.Brody.width * 0.6, game.config.width - this.Brody.width * 0.6]
          this.viablePaths = [false, false, false, false];

          this.spaceBackground.visible = true;

          this.clock = this.time.delayedCall(5000, () => {
            //this.background.y = game.config.height * 2;
            this.tweens.add({
              targets: this.background,
              y: game.config.height * 2,
              duration: 3000,
              ease: 'Expo'
            })
            this.tweens.add({
              targets: this.dropOff,
              y: game.config.height,
              duration: 3000,
              ease: 'Expo',
            });
            this.tweens.add({
              targets: this.filledStar,
              y: game.config.height,
              duration: 3000,
              ease: 'Expo',
            });
            this.Brody.clearTint();
          }, null, this);
      }

      if (this.gameWon){
        this.spaceBackground.tilePositionY -= this.spaceSpeed;
        if (this.spaceSpeed <= 20){
          this.spaceSpeed += 0.02;
        }
      }

      if (Phaser.Input.Keyboard.JustDown(keyM) ){
        this.music.mute = !this.music.mute;
      }
      if (Phaser.Input.Keyboard.JustDown(keyX) && this.followingBool){
        this.followingBool = false;
        this.following.visible = false;
        this.following.clearTint();
      }

      if (Phaser.Input.Keyboard.JustDown(keySPACE)){
        this.returnText.visible = true;
      }
      if (Phaser.Input.Keyboard.JustUp(keySPACE)){
        this.returnText.visible = false;
      }

      if (keySPACE.isDown ){
        this.returnTimer += delta;
        if (this.returnTimer >= 3000){
          this.scene.start('menuScene');
        }
      }

      this.Brody.update(time, delta);
      if (this.followingBool){
        this.orbit(this.following);
      }

      if (this.inRoom.visible){
        this.bounce(this.inRoom);
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
      if (!this.gameWon){
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
    }

    pickRoom(key, direction = 0){

      if (game.Maze.dict[key][4] == "TrapRoom"){
        let placedStart = false;

        while (!placedStart){
            let seed = Math.floor(Math.random() * 64);
            let newKey = ( Math.floor(seed/8) + 1) + ',' + ( seed%8 + 1);

            if (game.Maze.dict[newKey][2] != 4 && game.Maze.dict[newKey][2] != 0 && game.Maze.dict[newKey][4] == "None" && game.Maze.dict[newKey][2] != 1){
                console.log(newKey);
                this.currLoc = newKey;
                key = newKey;
                direction = 0;
                placedStart = true;
                this.Brody.x = game.config.width/2;
            }
        }
      }

      let pathArr = game.Maze.dict[key][1];

      this.Brody.clearTint();

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
            this.Brody.setTint(0x000000);
            this.Brody.flipX = !this.Brody.flipX;
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

      console.log(game.Maze.dict[key][4]);
      this.inRoom.visible = false;
      this.dropOff.visible = false;
      this.filledStar.visible = false;
      switch (game.Maze.dict[key][4]){
        case "RedStart":
          this.inRoom.visible = true;
          this.inRoom.setTint(0xDB4C40);
          if (this.following.tintTopLeft == 0xffffff && !this.filled[0]){
            this.following.visible = true;
            this.followingBool = true;
            this.following.setTint(0xDB4C40);
          }
          break;
        case "BlueStart":
          this.inRoom.visible = true;
          this.inRoom.setTint(0x90BEDE);
          if (this.following.tintTopLeft == 0xffffff && !this.filled[1]){
            this.following.visible = true;
            this.followingBool = true;
            this.following.setTint(0x90BEDE);
          }
          break;
        case "GreenStart":
          this.inRoom.visible = true;
          this.inRoom.setTint(0x143109);
          console.log(this.following.tintTopLeft);
          if (this.following.tintTopLeft == 0xffffff && !this.filled[2]){
            this.following.visible = true;
            this.followingBool = true;
            this.following.setTint(0x143109);
          }
          break;
        case "YellowStart":
          this.inRoom.visible = true;
          this.inRoom.setTint(0xF0EC57);
          if (this.following.tintTopLeft == 0xffffff && !this.filled[3]){
            this.following.visible = true;
            this.followingBool = true;
            this.following.setTint(0xF0EC57);
          }
          break;
        case "PurpleStart":
          this.inRoom.visible = true;
          this.inRoom.setTint(0x77567A);
          if (this.following.tintTopLeft == 0xffffff && !this.filled[4] ){
            this.following.visible = true;
            this.followingBool = true;
            this.following.setTint(0x77567A);
          }
          break;
        case "RedEnd":
          this.dropOff.visible = true;
          this.dropOff.setTint(0xDB4C40);
          if (this.filled[0]){
            this.filledStar.visible = true;
            this.filledStar.setTint(0xDB4C40);
          }
          if (this.following.tintTopLeft == 0xDB4C40){
            this.filled[0] = true;
            this.fillRoom();
            this.filledStar.setTint(0xDB4C40);
          }
          break;
        case "BlueEnd":
          this.dropOff.visible = true;
          this.dropOff.setTint(0x90BEDE);
          if (this.filled[1]){
            this.filledStar.visible = true;
            this.filledStar.setTint(0x90BEDE);
          }
          if (this.following.tintTopLeft == 0x90BEDE){
            this.filled[1] = true;
            this.fillRoom();
            this.filledStar.setTint(0x90BEDE);
          }
          break;
        case "GreenEnd":
          this.dropOff.visible = true;
          this.dropOff.setTint(0x143109);
          if (this.filled[2]){
            this.filledStar.visible = true;
            this.filledStar.setTint(0x143109);
          }
          if (this.following.tintTopLeft == 0x143109){
            this.filled[2] = true;
            this.fillRoom();
            this.filledStar.setTint(0x143109);
          }
          
          break;
        case "YellowEnd":
          this.dropOff.visible = true;
          this.dropOff.setTint(0xF0EC57);
          if (this.filled[3]){
            this.filledStar.visible = true;
            this.filledStar.setTint(0xF0EC57);
          }
          if (this.following.tintTopLeft == 0xF0EC57){
            this.filled[3] = true;
            this.fillRoom();
            this.filledStar.setTint(0xF0EC57);
          }
          
          break;
        case "PurpleEnd":
          this.dropOff.visible = true;
          this.dropOff.setTint(0x77567A);
          if (this.filled[4]){
            this.filledStar.visible = true;
            this.filledStar.setTint(0x77567A);
          }
          if (this.following.tintTopLeft == 0x77567A){
            this.filled[4] = true;
            this.fillRoom();
            this.filledStar.setTint(0x77567A);
          }
          
          break;
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
        let spot = this.add.sprite(64, 64, 'line').setOrigin(0.5,0.5);
        if (direction == 2 || direction == 3){
          spot.angle = 90;
        }
      }
      if (numPath == 3){
          let first = paths.indexOf(false);
          let rotation = [90, 270, 180, 0];
          let spot = this.add.sprite(64, 64, 'crossroads').setOrigin(0.5,0.5);
          spot.angle = rotation[first];
      }
      if (numPath == 1){
          let rotation = [0, 180, 90, 270];
          let spot = this.add.sprite(64,64, 'deadend').setOrigin(0.5,0.5);
          spot.angle = rotation[direction];
      }
      if (numPath == 2){
          let first = paths.indexOf(true);
          if (paths[first+1] && first != 1){
              let spot = this.add.sprite(64, 64, 'line').setOrigin(0.5,0.5);
              if (first == 2){
                  spot.angle = 90;
              }
          } else {
              let spot = this.add.sprite(64, 64, 'curvey').setOrigin(0.5,0.5);
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

    orbit(sprite){
      sprite.y = this.Brody.y - this.Brody.height + (game.config.height*0.25 * Math.sin(sprite.bounce));
      sprite.x = this.Brody.x + (game.config.width*0.25 * Math.sin(sprite.bounce + Math.PI/2));
      sprite.angle += 2;
      sprite.bounce += 0.04;
    }

    bounce(sprite){
      sprite.y = game.config.height * 0.8 + (game.config.height*0.3 * Math.sin(sprite.bounce));
      sprite.bounce += 0.04;
      sprite.angle += 2;
    }

    fillRoom(){
      let myTarget = this.following;
      let myRoomStar = this.filledStar;
      this.following.angle = 0;
      this.following.x = game.config.width/2;
      this.following.y = game.config.height/2;
      let myTween = this.tweens.add({
        targets: this.following,
        x: this.filledStar.x,
        y: this.filledStar.y,
        duration: 3000,
        ease: 'Expo',
        delay: 1000,
        onComplete: function () {
          myTarget.visible = false;
          myTarget.clearTint();
          myRoomStar.visible = true;
        }
      });
      this.followingBool = false;
      this.score += 1;
      switch (this.score) {
        case 1:
          this.queuedTransition.push("chorusLoop");
          this.currLoop = 'chorusLoop';
          break;
        case 2:
          this.queuedTransition.push("technoLoop");
          this.currLoop = 'technoLoop';
          break;
        case 3:
          this.queuedTransition.push("guitarLoop");
          this.currLoop = 'guitarLoop';
          break;
        case 4:
          this.queuedTransition.push("guitarTrans");
          this.queuedTransition.push("brodyLoop");
          this.currLoop = "brodyLoop";
          break;
        case 5:
          this.queuedTransition.push("finale");
          this.currLoop = false;
          break;
      }
    }

    markBQ(){
      this.music.addMarker({name: "veryStart", start: 0, duration: 20.426, config: this.musicConfig});
      this.music.addMarker({name: "pianoLoop", start: 20.426, duration: 40.851, config: this.musicConfig});
      this.music.addMarker({name: "chorusLoop", start: 61.277, duration: 40.851, config: this.musicConfig});
      this.music.addMarker({name: "technoLoop", start: 102.128, duration: 20.425, config: this.musicConfig});
      this.music.addMarker({name: "guitarLoop", start: 122.553, duration: 30.638, config: this.musicConfig});
      this.music.addMarker({name: "guitarTrans", start: 153.191, duration: 20.425, config: this.musicConfig});
      this.music.addMarker({name: "brodyLoop", start: 173.617, duration: 10.213, config: this.musicConfig});
      this.music.addMarker({name: "finale", start: 183.830, duration: 55, config: this.musicConfig});
      this.currLoop = "pianoLoop";
    }

    gameEnd(){
      this.add.text(game.config.width/2, game.config.height/4, 'Congratulations on completing BrodyHalls!', this.textConfig).setOrigin(0.5);
      this.add.text(game.config.width/2, game.config.height/4 + 64, 'Hold Space to Return to Menu', this.textConfig).setOrigin(0.5);
    }
}

function audioController(scene, music){
  if (scene.queuedTransition.length > 0){
    if ( scene.queuedTransition[0] == "finale"){
        music.play(scene.queuedTransition.shift());
        music.once('complete', function(){ scene.gameEnd()});
    } else{
        music.play(scene.queuedTransition.shift());
        music.once('complete', function(){ audioController(scene, music) });
    }
  } else if (scene.currLoop){
      music.play(scene.currLoop);
      music.once('complete', function(){ audioController(scene, music) }); 
  }
}