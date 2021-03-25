import Phaser from 'phaser';
import Level1 from './scenes/Level1';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 640,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: true,
            debugShowBody: true,
            debugShowStaticBody: true,
            debugShowVelocity: true,
        }
    },
    scene: [
        Level1
    ]
};

const game = new Phaser.Game(config);
console.log(game);
