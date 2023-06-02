export default class Score extends Phaser.Scene{
    constructor(){
        super({key: 'Score', active : true});
    }
    numStars;
    scoreText;
    numStarsText;

    
    init(data){
        if(data.numStars === undefined){
            this.numStars = 0;
        } else{
    this.numStars = data.numStars;
        }

    }
    create(){
        this.numStarsText = this.add.text(
            20,
            20,
            "Score: " + this.numStars,
            { fontSize: "32px", fill: "#FFFFFF", fontStyle: "bold" }
          );

        
    }

    update(data){
        if(data.numStars === undefined){
            this.numStars = 0;
        } else{
    this.numStars = data.numStars;
        }
    }
}