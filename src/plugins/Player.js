/**
 * @author    Victor Cabello <vmeca87@gmail.com>
 * @copyright 2021 Victor Cabello
 * @license   {@link https://opensource.org/licenses/MIT|MIT License}
 */
import Phaser from 'phaser';
import playerPNG from 'url:../assets/img/king.png';
import machina from 'machina';
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
            FSM_CONFIG['player'] = this;
            FSM_CONFIG['scene'] = this.scene;
            this.FSM = new machina.Fsm(FSM_CONFIG);
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
        this.createAnims('walk', 1, 4, {repeat: -1});
        this.createAnims('jump', 8, 17);
        this.createAnims('clim', 18, 22, {repeat: -1});

        this.walk();
    }

    step(keys){
        this.FSM.step(keys);
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
        }
        scene.anims.create(finalConfig);
        this[key] = function() {
            this.sprite.anims.play(key);
        }
    }
}

const FSM_CONFIG = {
    initialState: 'idle',
    step: function(keys){
        this.keys = keys;
        const {left, right} = this.keys;
        if(left) {this.player.sprite.setFlipX(true);}
        if(right) {this.player.sprite.setFlipX(false);}
        this.handle('step');
    },
    states: {
        "idle": {
            step: function(){
                const {left, right, up} = this.keys;
                if(left || right){
                    this.transition('move');
                }
                else if(up && this.player.sprite.body.blocked.down){
                    this.transition('jump');
                }
            },
            _onEnter: function(){
                this.player.idle();
                this.player.sprite.setVelocityX(0);
            }
        },
        "move":{
            step: function(){
                const {left, right} = this.keys;
                if(this.player.sprite.body.blocked.down &&
                    (left || right)){
                    this.transition('walk');
                }
                else if(this.player.sprite.body.blocked.down &&
                        !(left || right)){
                    this.transition('idle');
                }

            },
            _onEnter: function(){
                velocity = this.player.sprite.flipX ? -100: 100;
                this.player.sprite.setVelocityX(velocity);
            }
        },
        "walk":{
            step: function(){
                const {left, right, up, down} = this.keys;
                if(!(left || right || up || down)){
                    this.transition('idle');
                }
                else if(this.player.sprite.body.blocked.down && up){
                    this.transition('jump');
                }
            },
            _onEnter: function(){
                this.player.walk();
                velocity = this.player.sprite.flipX ? -100: 100;
                this.player.sprite.setVelocityX(velocity);
            }
        },
        "jump":{
            step: function(){
                const {left, right, up, down} = this.keys;
                if(this.player.sprite.body.blocked.down &&
                   !(left || right || up || down)){
                    this.transition('idle');
                }
                else if(left || right){
                    this.transition('move');
                }
            },
            _onEnter: function(){
                this.player.sprite.setVelocityY(-150);
                this.player.jump();
            }
        }
    }
}
