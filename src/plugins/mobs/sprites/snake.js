/**
 * @author    Victor Cabello <vmeca87@gmail.com>
 * @copyright 2021 Victor Cabello
 * @license   {@link https://opensource.org/licenses/MIT|MIT License}
 */
import Phaser from 'phaser';
import {Machine, interpret} from 'xstate';



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
       this.body.onWorldBounds = true;

        this.createAnims('idle', 1, 1);
        this.createAnims('walk', 1, 4, {repeat: -1});
        this.createAnims('jump', 1, 3);

        this.initFSM();
    }


    stop() {
        this.anims.play('snake_idle');
        this.setVelocityX(0);
    }

    move() {
        this.anims.play('snake_walk');
        const speed = 100;
        const velocity = this.flipX ? -1 * speed : speed;
        this.setVelocityX(velocity);
    }

    jump() {
        this.anims.play('snake_jump');
        this.setVelocityY(-150);
    }

    turn(){
        this.setVelocityX(0);
        this.toggleFlipX();
    }

    destroy() {
        this.timer.destroy();
        super.destroy();
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
            repeat: 0
        };
        const finalConfig ={
            ...config,
            ...additionalAnimsConfig
        };
        scene.anims.create(finalConfig);
    }

    initFSM() {
        const context = this;
        const SnakeFSM = {
            id: 'snakeFSM',
            initial: 'idle',
            context: context,
            states: {
                idle: {
                    on: {
                        DESTROY: { actions: 'destroy' },
                        TURN: { actions: 'turn' },
                        MOVE: { target: 'walking' },
                        JUMP: { target: 'jumping' }
                    },
                    onEntry: 'stop'
                },
                walking: {
                    on: {
                        DESTROY: { actions: 'destroy' },
                        TURN: { actions: 'turn' },
                        STOP: { target: 'idle' },
                        JUMP: { target: 'jumping' }
                    },
                    onEntry: 'move'
                },
                jumping: {
                    on: {
                        DESTROY: { actions: 'destroy' },
                        TURN: { actions: 'turn' },
                        STOP: { target: 'idle' },
                        MOVE: { target: 'walking' }
                    },
                    onEntry: 'jump'
                }
            }
        };

        this.machine = new Machine(SnakeFSM,
            {
                actions: {
                    stop: function () { context.stop(); },
                    move: function () { context.move(); },
                    turn: function () { context.turn(); },
                    jump: function () { context.jump(); },
                    destroy: function () { 
                        context.timer.destroy();
                        context.destroy();
                     }
                }
            });
        this.interpret = interpret(this.machine);
        this.interpret.start();

        const trigger = this.interpret;

        this.timer = this.scene.time.addEvent({
            delay: 1000,
            loop: true,

            callback: function () {
                const events = ['STOP', 'MOVE', 'TURN', 'JUMP'];
                const currentIndex = Math.floor(Math.random() * 4);
                trigger.send(events[currentIndex]);
            }
        });
    }
}