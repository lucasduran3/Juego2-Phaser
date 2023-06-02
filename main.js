import Game from "./public/assets/scenes/Game.js";
import Preload from "./public/assets/scenes/Preload.js";
import Win from "./public/assets/scenes/Win.js";
import GameLvl from "./public/assets/scenes/GameLvl.js";
import GameOver from "./public/assets/scenes/GameOver.js"
import Score from "./public/assets/scenes/Score.js";
import Timer from "./public/assets/scenes/Timer.js";


// Create a new Phaser config object
const config = {
  type: Phaser.AUTO,
  width: 767,
  height: 575,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600,
    },
    max: {
      width: 1600,
      height: 1200,
    },
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 },
      debug:false,
    },
  },
  // List of scenes to load
  // Only the first scene will be shown
  // Remember to import the scene before adding it to the list
  scene: [Preload,Game, GameLvl, Score, Win, GameOver, Timer],
};

// Create a new Phaser game instance
window.game = new Phaser.Game(config);
