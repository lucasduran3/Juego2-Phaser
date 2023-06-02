export default class Timer extends Phaser.Scene{
    constructor(){
        super({key : 'Timer', active : true});
    }
    timer;

    create(){
        this.timer = 30;
        this.timerText = this.add.text(700, 20, this.timer, {
        fontSize: "32px",
        fontStyle: "bold",
        fill: "#FFF"
        });

        this.time.addEvent({
            delay: 1000,
            callback: this.onSecond,
            callbackScope: this, 
            loop: true
          });
    }

    onSecond(){
        this.timer--;
        this.timerText.setText(this.timer);
        if(this.timer<0){
          this.scene.start("GameOver");
          this.scene.stop();
        }
      }

}