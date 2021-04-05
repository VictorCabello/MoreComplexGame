/**
 * @author    Victor Cabello <vmeca87@gmail.com>
 * @copyright 2021 Victor Cabello
 * @license   {@link https://opensource.org/licenses/MIT|MIT License}
 */
import Phaser from 'phaser';

export class PlayerSprite extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y) {
        super(scene, x, y, 'atlas', 'king0');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0, 0);
        this.setSize(this.width -20 , this.height -10).setOffset(10, 10);

        this.scale = 2;
        this.setCollideWorldBounds(false);

        this.createAnims('idle', 0, 0);
        this.createAnims('walk', 15, 17, {repeat: -1});
        this.createAnims('jump', 8, 10);
        this.createAnims('clim', 18, 22, {repeat: -1});
    }

    playIdle() {
        this.anims.play('idle');
    }

    playWalk() {
        this.anims.play('walk');
    }

    playJump() {
        this.anims.play('jump');
    }

    createAnims(key, start, end, additionalAnimsConfig={},
                additionalFrameConfig={}) {
        const scene = this.scene;
        const config = {
            key: key,
            frames: scene.anims.generateFrameNames(
                'atlas',
                {
                    prefix: 'king',
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
