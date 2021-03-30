/**
 * @author    Victor Cabello <vmeca87@gmail.com>
 * @copyright 2021 Victor Cabello
 * @license   {@link https://opensource.org/licenses/MIT|MIT License}
 */
import Phaser from 'phaser';

export class SnakeSprite extends Phaser.Physics.Arcade.Sprite {

    constructor (scene, x, y) {
        super(scene, x, y, 'atlas', 'snake1');

        scene.add.existing(this);
        scene.physics.add.existing(this);

       this.setOrigin(0, 0);
       this.setSize(this.width -20 , this.height -20).setOffset(10, 20);

       this.scale = 2;
       this.setBounce(0.1);
       this.setCollideWorldBounds(true);

        this.createAnims('idle', 1, 1);
        this.createAnims('walk', 1, 4, {repeat: -1});
        this.createAnims('jump', 1, 3);
        console.log('entroo.....');
    }

    preUpdate ( time, deltaTime ) {
        super.preUpdate(time, deltaTime);
    }

    playIdle() {
        this.anims.play('snake_idle');
    }

    playWalk() {
        this.anims.play('snake_walk');
    }

    playJump() {
        this.anims.play('snake_jump');
    }

    createAnims(key, start, end, additionalAnimsConfig={},
                additionalFrameConfig={}) {
        const scene = this.scene;
        const config = {
            key: 'snake_' + key,
            frames: scene.anims.generateFrameNames(
                'atlas',
                {
                    prefix: 'snake',
                    start: start,
                    end: end
                }
            ),
            frameRate: 4,
            repeat:0
        };
        const finalConfig ={
            ...config,
            ...additionalAnimsConfig
        };
        scene.anims.create(finalConfig);
    }

}
