export default class Win extends Phaser.Scene{
    constructor(){
        super("Win");
    }

    numStars;
    create(){
        this.scene.stop("Timer");
        this.add.image(383, 287, "win")
            .setInteractive()
            .on('pointerdown', () => (this.scene.start('Game'), this.scene.start("Timer")));
            this.scene.run("Score", {
                numStars : this.numStars
            });
    }
}