import Phaser from 'phaser';
import Level1 from './scenes/Level1';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 640,
    debug: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: [
        Level1
    ]
};

const game = new Phaser.Game(config);
console.log(game);
