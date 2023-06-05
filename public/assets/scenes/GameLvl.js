export default class GameLvl extends Phaser.Scene {
    constructor() {
      super("GameLvl");
    }
    numStars;
    gameWin;
    gameOver;
  
    init(data) {
      this.numStars = data.numStars;
      this.gameOver = false;
      this.gameWin = false;
    }
  
    create() {
      
      //this.scene.start("ScoreTime");
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
  
      const map = this.make.tilemap({ key: "map2" });
  
      const skyLayer = map.addTilesetImage("sky", "tilesBack");
      const platformsLayer = map.addTilesetImage("platform", "tilesPlatform");

      const bgLayer = map.createLayer("background", skyLayer, 0, 0);
      const platformLayer = map.createLayer(
        "platforms",
        platformsLayer,
        0,
        0
      );

  
      const objectsLayer = map.getObjectLayer("objects");
  
      platformLayer.setCollisionByProperty({ colision: true });
  
      let spawnPoint = map.findObject(
        "objects",
        (obj) => obj.name === "player"
      );
      this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "dude");
  
      spawnPoint = map.findObject("objects", (obj) => obj.name === "exit");
      this.exit = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "exit").setScale(0.2);
      this.exit.visible = false;

      this.player.setBounce(0.1);
      this.player.setCollideWorldBounds(true);
      
      spawnPoint = map.findObject("objects", (obj) => obj.name === "robot");
      this.robot = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "robot").setScale(0.1).setCircle(150,0,-1);
      this.robot.setCollideWorldBounds(true);
      this.robot.setGravity(1000)

      this.cursors = this.input.keyboard.createCursorKeys();
  

      this.stars = this.physics.add.group();  
      this.bombs = this.physics.add.group();

      objectsLayer.objects.forEach((objData) => {

  
        const { x = 0, y = 0, name } = objData;
        switch (name) {
          case "star": {

            const star = this.stars.create(x, y, "star").setCircle(10, 2, 1).setBounce(0.5);
            break;
          }
          case "bomb" : {
            this.bomb = this.bombs.create(x, y, "bomb").setScale(1.5).setCircle(7, -1,-1 ).setBounce(0.2);
          }
        }
      });
     

  
      this.physics.add.collider(this.player, platformLayer);
      this.physics.add.collider(this.stars, platformLayer);
      this.physics.add.collider(this.stars, this.player);
      this.physics.add.collider(this.player, this.exit);
      this.physics.add.collider(this.exit, platformLayer);
      this.physics.add.collider(this.bombs, platformLayer);
      this.physics.add.collider(this.bombs, this.player);
      this.physics.add.collider(this.bombs, this.stars);
      this.physics.add.collider(this.robot, this.player);
      this.physics.add.collider(this.robot, platformLayer);
      
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
        () => this.stars.getTotalUsed() === 0,
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
     
      this.cameras.main.startFollow(this.player);
      this.physics.world.setBounds(0,0, map.widthInPixels, map.heightInPixels);
      this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
      

      /*this.numStarsText = this.add.text(
        20,
        20,
        "Score: " + this.numStars,
        { fontSize: "32px", fill: "#FFFFFF", fontStyle: "bold" }
      );*/
    }

    update() {
      this.enemyFollows();
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-160);
        this.player.anims.play("left", true);
      }
      else if (this.cursors.right.isDown) {
        this.player.setVelocityX(160);
        this.player.anims.play("right", true);
      }
      else {
        this.player.setVelocityX(0);
        this.player.anims.play("turn");
      }
  
      if (this.cursors.up.isDown && this.player.body.blocked.down) {
        this.player.setVelocityY(-230);
      }
  
     if(this.gameOver === true){
        this.scene.start("GameOver");
      }
      if(this.stars.getTotalUsed() === 0){
        this.exit.visible = true;
      }
    }

    collectStar(player, stars){ 
      stars.destroy(true);
      this.numStars++;
      //this.numStarsText.setText("Score: " + this.numStars);   
      this.scene.run("Score",{
        numStars : this.numStars
      });

    }
  
    onSecond(){
      this.timer--;
      this.timerText.setText(this.timer);
      if(this.timer<0){
        this.gameOver = true;
      }
    }
  
    isWin(player, exit){
      this.scene.start("Win",{
        numStars : this.numStars,
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