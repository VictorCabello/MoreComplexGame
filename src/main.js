/**
 * @author    Victor Cabello <vmeca87@gmail.com>
 * @copyright 2021 Victor Cabello
 * @license   {@link https://opensource.org/licenses/MIT|MIT License}
 */
import Phaser from 'phaser';
import Level1 from './scenes/Level1';

/**
 * @constant
 * @type {Phaser.Types.Core.GameConfig} [GameConfg] - The main configuration of the game
 */
const config = {
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
