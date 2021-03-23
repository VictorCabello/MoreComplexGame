/**
 * @author    Victor Cabello <vmeca87@gmail.com>
 * @copyright 2021 Victor Cabello
 * @license   {@link https://opensource.org/licenses/MIT|MIT License}
 */
import Phaser from 'phaser';
import playerPNG from 'url:../assets/img/king.png';
/**
 * Plugin to control the player animations.
 *
 * @class
 * @name MoreComplexGame.PlayerPlugin
 */
export default class PlayerPlugin extends Phaser.Plugins.ScenePlugin {

    /**
     * Sprite that is a graphic representation of the player but it is affected
     * by the physics.
     *
     * @name sprite
     * @type {Phaser.Types.Physics.Arcade.SpriteWithDynamicBody}
     */
    sprite = null;

    /**
     * Load a png image to be used on the animations fo the player.
     *
     * In this case the images is a very width image with 23 frames of 32 x 32.
     */
    boot() {
        this.scene.load.spritesheet({
            key: 'player',
            url: playerPNG,
            frameConfig: {
                frameWidth: 32,
                frameHeight: 32,
                startFrame: 0,
                endFrame: 23
            }
        });
    }

    /**
     * Create and return the sprite.
     *
     * @see sprite
     * @param {number} x - X position where the sprite will be created.
     * @param {number} y - Y position where the sprite will be created.
     */
    create(x, y) {
        if(this.sprite === null){
            this.createSprite(x, y);
        }
        return this.sprite;
    }

    createSprite(x, y) {
        this.sprite = this.scene.physics.add.sprite(x, y, 'player');
        this.sprite.setBounce(0.1);
        this.sprite.setCollideWorldBounds(true);
    }
}
