export default class GameOver extends Phaser.Scene {
    constructor() {
        super("GameOver");
    }
    numStars;

    create() {
        this.scene.stop("Timer");
        this.add.image(400, 300, "gameOver")
            .setInteractive()
            .on('pointerdown', () => (this.scene.start('Game'), this.scene.start("Timer")));
            this.scene.run("Score", {
                numStars : this.numStars
            });
    }
}
