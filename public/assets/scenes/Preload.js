export default class Preload extends Phaser.Scene{
    constructor(){
        super("Preload");
    }

    preload(){
        this.load.tilemapTiledJSON("map", "./public/tilemaps/nivel1.json");
        this.load.tilemapTiledJSON("map2", "./public/tilemaps/level2.json");
        this.load.image("tilesBack", "./public/assets/images/sky.png");
        this.load.image("tilesPlatform", "./public/assets/images/platform.png");
        this.load.image("win", "./public/assets/images/win.png");
        this.load.image("robot", "./public/assets/images/robot.png");
        this.load.image("gameOver", "./public/assets/images/gameOver.png")
        this.load.image("bomb", "./public/assets/images/bomb.png");
        this.load.image("star", "./public/assets/images/star.png");
        this.load.image('exit', "./public/assets/images/salida.png");
        this.load.spritesheet("dude", "./public/assets/images/dude.png", {
          frameWidth: 32,
          frameHeight: 48,
        });
    }

    create() {
        this.scene.start("Game");
    }
}