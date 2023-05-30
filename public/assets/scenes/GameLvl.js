export default class GameLvl extends Phaser.Scene {
    constructor() {
      // key of the scene
      // the key will be used to start the scene by other scenes
      super("GameLvl");
    }
  
    init(data) {
      // this is called before the scene is created
      // init variables
      // take data passed from other scenes
      // data object param {}
      console.log(data);
      this.numStars = data.numStars;
    }
  
    create() {
      this.numStarsText = this.add.text(
        20,
        20,
        "Estrellas recolectadas: " + this.numStars,
        { fontSize: "32px", fill: "#FFFFFF", fontStyle: "bold" }
      );
    }
  }