// URL to explain PHASER scene: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/scene/

export default class Game extends Phaser.Scene {
  constructor() {
    // key of the scene
    // the key will be used to start the scene by other scenes
    super("Game");
  }
  gameWin;
  gameOver;
  numStars;

  init() {
    this.scene.stop("Score")
    this.scene.run("Score");
    this.gameOver = false;
    this.gameWin = false;
    // this is called before the scene is created
    // init variables
    // take data passed from other scenes
    // data object param {}
  }

  preload() {
    // load assets
   
  }

  create() {
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("dude", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });

    const map = this.make.tilemap({ key: "map" });

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const skyLayer = map.addTilesetImage("sky", "tilesBack");
    const platformsLayer = map.addTilesetImage("platform", "tilesPlatform");
    //const exitLayer = map.addTilesetImage("exit", "tilesExit");

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const bgLayer = map.createLayer("background", skyLayer, 0, 0);
    const platformLayer = map.createLayer(
      "platforms",
      platformsLayer,
      0,
      0
    );
    //const exit = map.createLayer("exit", exitLayer, 0, 0);

    const objectsLayer = map.getObjectLayer("objects");

    platformLayer.setCollisionByProperty({ colision: true });

    console.log(objectsLayer);


    // crear el jugador
    // Find in the Object Layer, the name "dude" and get position
    let spawnPoint = map.findObject(
      "objects",
      (obj) => obj.name === "player"
    );
    this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "dude");

    spawnPoint = map.findObject("objects", (obj) => obj.name === "exit");
    this.exit = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "exit").setScale(0.2);
    this.exit.visible = false;
    
    // create robot

   spawnPoint = map.findObject("objects", (obj) => obj.name === "robot");
    this.robot = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "robot").setScale(0.1).setCircle(150,0,-1);
    this.robot.setCollideWorldBounds(true);
    this.robot.setGravity(1000)

    //  Player physics properties. Give the little guy a slight bounce.
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);

    //  Input Events
    this.cursors = this.input.keyboard.createCursorKeys();

    // Create empty group of starts
    this.stars = this.physics.add.group();
    
    
    // find object layer
    // if type is "stars", add to stars group
    objectsLayer.objects.forEach((objData) => {
      //console.log(objData.name, objData.type, objData.x, objData.y);

      const { x = 0, y = 0, name } = objData;
      switch (name) {
        case "star": {
          // add star to scene
          // console.log("estrella agregada: ", x, y);
          const star = this.stars.create(x, y, "star").setCircle(32, 0, 0).setBounce(0.5).setCircle(10, 2, 1).setBounce(0.5);
          break;
        }
      }
    });

    this.bombs = this.physics.add.group();
    objectsLayer.objects.forEach((objData) => {
      //console.log(objData.name, objData.type, objData.x, objData.y);
      const { x = 0, y = 0, name } = objData;
      switch (name) {
        case "bomb": {
          // add star to scene
          // console.log("estrella agregada: ", x, y);
          const star = this.bombs.create(x, y, "bomb").setScale(1.5).setScale(1.5).setCircle(5, 2, 2).setBounce(0.2);
          break;
        }
      }
    });

    
    this.numStars = 0;
    /*this.scoreText = this.add.text(20, 20, "Score:" + this.numStars, {
    fontSize: "32px",
    fontStyle: "bold",
    fill: "#FFF"
    });*/

    /*this.timer = 30;
    this.timerText = this.add.text(700, 20, this.timer, {
      fontSize: "32px",
      fontStyle: "bold",
      fill: "#FFF"
    });*/
    
    /*this.time.addEvent({
      delay: 1000,
      callback: this.onSecond,
      callbackScope: this, 
      loop: true
    });*/

    this.time.addEvent({
      delay:1000,
      callback: this.addBomb,
      callbackScope: this,
      loop: true
    });

    this.physics.add.collider(this.player, platformLayer);
    this.physics.add.collider(this.stars, platformLayer);
    this.physics.add.collider(this.stars, this.player);
    this.physics.add.collider(this.player, this.exit);
    this.physics.add.collider(this.exit, platformLayer);
    this.physics.add.collider(this.bombs, platformLayer);
    this.physics.add.collider(this.bombs, this.player);
    this.physics.add.collider(this.robot, platformLayer);
    this.physics.add.collider(this.robot, this.player);

    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.exit,
      this.isWin,
      () => this.numStars >= 1,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.bombs,
      this.bombExplosion,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.robot,
      this.bombExplosion,
      null,
      this
    );
  }

  update() {
    this.enemyFollows();

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("left", true);
    }
    //move right
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("right", true);
    }
    //stop
    else {
      this.player.setVelocityX(0);
      this.player.anims.play("turn");
    }

    //jump
    if (this.cursors.up.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-230);
    }

   if(this.gameOver === true){
      this.scene.start("GameOver");
    }
  }

  collectStar(player, stars) { 
    stars.destroy(true);
    this.numStars++;
    //this.scoreText.setText("Score: " + this.numStars);
    console.log(this.scene);
    this.scene.run("Score",{
      numStars : this.numStars
    });
    if(this.stars.getTotalUsed() === 0){
      this.exit.visible = true;
    }
  }

  onSecond(){
    this.timer--;
    this.timerText.setText(this.timer);
    if(this.timer<0){
      this.gameOver = true;
    }
  }

  isWin(player, exit){
    this.scene.start("GameLvl",{
      numStars : this.numStars
    });
    this.scene.stop("Timer");
    this.scene.start("Timer");
  }

  bombExplosion(player, bomb){
    this.scene.start("GameOver");
  }
  enemyFollows () {
    this.physics.moveToObject(this.robot, this.player, 60);
}
}
