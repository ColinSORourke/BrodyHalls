// Rocket prefab
class Brody extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
      super(scene, x, y, texture, frame);
  
      // add object to existing scene
      scene.add.existing(this);
      this.moveSpeed = 6;
      this.angle = 0;
      this.nextAngle = [10];
      this.beatCount = 0
    }

    update(time, delta) {
        if (Math.abs(this.angle) == 5){
            this.angle = this.nextAngle.shift();
            if (this.angle == 0){
                this.y -= 15;
            } else {
                this.y += 15;
            }
            if (this.nextAngle.length == 0){
                this.nextAngle.push(0);
                this.nextAngle.push(-this.angle);
            }
        }
        
        if (this.beatCount != Math.floor((time + 15) * (47/15000) ) ){
            this.beatCount = Math.floor((time + 15) * (47/15000));
            this.angle = (this.angle + this.nextAngle[0])/2;
            if (this.nextAngle[0] == 0){
                this.y -= 15;
            } else {
                this.y += 15;
            }
        }
    }
}