/**
 * @author    Victor Cabello <vmeca87@gmail.com>
 * @copyright 2021 Victor Cabello
 * @license   {@link https://opensource.org/licenses/MIT|MIT License}
 */
import Phaser from 'phaser';
import {Machine, interpret} from 'xstate';
import {FSM_XSTATE, FSM_OPTIONS} from './state_configuration.js';
// Assets
import playerPNG from 'url:./assets/king.png';
/**
 * Plugin to control the player animations.
 *
 * @class
 * @name MoreComplexGame.PlayerPlugin
 */
export default class PlayerPlugin extends Phaser.Plugins.ScenePlugin {
    /**
     * State machine to handle of the player behavior.
     */
    machine = null;
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
            FSM_XSTATE['context']['player'] = this.sprite;
            this.machine = new Machine(FSM_XSTATE, FSM_OPTIONS);
            this.interpret = interpret(this.machine);
            this.interpret.start();
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
        this.sprite.scale = 2;
        this.sprite.setBounce(0.1);
        this.sprite.setCollideWorldBounds(true);
        this.createAnims('idle', 0, 0);
        this.createAnims('walk', 15, 17, {repeat: -1});
        this.createAnims('jump', 8, 10);
        this.createAnims('clim', 18, 22, {repeat: -1});
    }

    /**
     * Helper to generate animations based on the png image.
     *
     * @private
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
            frameRate: 4,
            repeat:0
        };
        const finalConfig ={
            ...config,
            ...addtionalProperty
        };
        scene.anims.create(finalConfig);
        this[key] = function() {
            this.sprite.anims.play(key);
        };
    }
    /**
     * Send events to the state machine based on the inputs.
     *
     * @param inputs {Object} all the inputs that on the control
    * @param input {Object} the player plugin that handle all the graphics.
     */
    send(inputs) {
        this.handleDirection(inputs);

        const event = this.createEvent(inputs);
        this.interpret.send(event);
    }

    handleDirection(inputs){
        const {left, right} = inputs;
        if(left) {this.sprite.setFlipX(true);}
        if(right){this.sprite.setFlipX(false);}
    }

    createEvent(inputs){
        const {left, right, up} = inputs;
        let event = (left || right)? 'MOVE':'STOP';
        event = (up)? 'JUMP': event;
        event = (up) && (left || right)? 'JUMP_MOVE': event;
        return event;
    }
}