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
     * If the sprite is not initialized this method initialize and return the sprite else just return
     * the sprite.
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

    /**
     * This method initialize sprite.
     *
     * @see sprite
     * @private
     * @param {number} x - X position where the sprite will be created.
     * @param {number} y - Y position where the sprite will be created.
     */
    createSprite(x, y) {
        this.sprite = this.scene.physics.add.sprite(x, y, 'player');
        this.sprite.setBounce(0.1);
        this.sprite.setCollideWorldBounds(true);
        this.createAnims('idle', 0, 0);
        this.createAnims('walk', 0, 4, {repeat: -1});
        this.createAnims('jump', 8, 17);
        this.createAnims('clim', 18, 22, {repeat: -1});

        this.clim();
    }

    /**
     * Helper to generate animations based on the png image.
     *
     * @param {string} key - name of the animation should be unique.
     * @param {number} start - first frame of the animation.
     * @param {number} end - last frame of the animation.
     * @param {object} addtionalProperty - any additional configuration for the animation
     */
    createAnims(key, start, end, addtionalProperty={}) {
        const scene = this.scene;
        const config = {
            key: key,
            frames: scene.anims.generateFrameNumbers(
                'player',
                {
                    start: start,
                    end: end
                }
            ),
            frameRate: 8,
            repeat:0
        };
        const finalConfig ={
            ...config,
            ...addtionalProperty
        }
        scene.anims.create(finalConfig);
        this[key] = function() {
            console.log(key);
            this.sprite.anims.play(key);
        }
    }
}
