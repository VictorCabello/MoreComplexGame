/**
 * @author    Victor Cabello <vmeca87@gmail.com>
 * @copyright 2021 Victor Cabello
 * @license   {@link https://opensource.org/licenses/MIT|MIT License}
 */
import Phaser from 'phaser';
import {Machine, interpret} from 'xstate';

export class FireBallSprite extends Phaser.Physics.Arcade.Sprite {

    constructor (scene, x, y) {
        super(scene, x, y, 'atlas', 'fireball/1');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0, 0);
        this.setSize(this.width -40 , this.height -45).setOffset(20, 20);

        this.createAnims('idle', 1, 60);
        this.anims.play('fireball_idle');
        this.initFSM();
    }

    send( event ) {
        this.interpret.send(event);
    }


    stop() {
        this.setVelocityX(0);
        this.setActive(false);
        this.setVisible(false);
    }

    move( context, event ) {
        const player = event.player;
        const {x, y} = player.sprite;
        this.setPosition(x, y + 9);
        this.setActive(true);
        this.setVisible(true);
        const speed = 400;
        const range = this.flipX ? -1 * speed : speed;
        context.spelltween = 
        context.scene.tweens.add({
            targets: this,
            x: x + range,
            duration: 1000,
            ease: 'Circ.easeInOut',
            onCompleteScope: this,
            onComplete: () => this.send('COMPLETE')
        });
    }

    exitMove( context, event ){
        context.spelltween.remove()
    }

    turn(){
        this.setVelocityX(0);
        this.toggleFlipX();
    }

    destroy() {
        this.timer.destroy();
        super.destroy();
    }

    createAnims(key, start, end, additionalAnimsConfig={}){
        const scene = this.scene;
        const config = {
            key: 'fireball_' + key,
            frames: scene.anims.generateFrameNames(
                'atlas',
                {
                    prefix: 'fireball/',
                    start: start,
                    end: end
                }
            ),
            frameRate: 12,
            repeat: -1
        };
        const finalConfig ={
            ...config,
            ...additionalAnimsConfig
        };
        scene.anims.create(finalConfig);
    }

    initFSM() {
        const context = this;
        const FireballFSM = {
            id: 'fireballFSM',
            initial: 'idle',
            context: context,
            states: {
                idle: {
                    on: {
                        FIRE: 'moving',
                        RIGHT: {  actions: 'right' },
                        LEFT:  {  actions: 'left' },
                    },
                    onEntry: 'stop'
                },
                moving: {
                    on: {
                        COMPLETE: 'coolingdown',
                        HIT: 'coolingdown',
                    },
                    entry: 'move',
                    exit: 'exitMove'
                },
                coolingdown: {
                    always: 'idle'
                }
            }
        };

        this.machine = new Machine(FireballFSM,
            {
                actions: {
                    stop: function () { context.stop(); },
                    move: function (context, event) { context.move(context, event); },
                    turn: function () { context.turn(); },
                    exitMove: function (context, envent ) { context.exitMove(context, event); },
                    right: (context) => context.setFlipX(false),
                    left: (context) => context.setFlipX(true),
                    destroy: function () { 
                        context.timer.destroy();
                        context.destroy();
                     }
                }
            });
        this.interpret = interpret(this.machine);
        this.interpret.start();
    }
}