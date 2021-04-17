// Rocket prefab
class Brody extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);
  
      // add object to existing scene
      scene.add.existing(this);
      this.moveSpeed = 2;
      this.angle = 0;
      this.nextAngle = [10];
      this.beatCount = 0
      this.base = y;
    }

    update(time, delta) {
        if(keyLEFT.isDown){
            this.flipX = false;
            this.x -= this.moveSpeed;
        }
        else if (keyRIGHT.isDown) {
            this.flipX = true;
            this.x += this.moveSpeed;
        }

        if (this.x <= -this.width/2 - 15){
            this.x = game.config.width + this.width/2;
        }
        if (this.x >= game.config.width + this.width/2 + 15){
            this.x = -this.width/2;
        }

        if (this.beatCount != Math.floor(time * (47/15000) ) ){
            this.beatCount = Math.floor(time * (47/15000));
            this.angle = this.nextAngle.shift();
            this.y = this.base - 3 * (10 - Math.abs(this.angle));
            if (this.nextAngle.length == 0){
                this.nextAngle.push(0);
                this.nextAngle.push(-this.angle);
            }
        }
    }
}