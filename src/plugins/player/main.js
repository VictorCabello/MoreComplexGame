/**
 * @author    Victor Cabello <vmeca87@gmail.com>
 * @copyright 2021 Victor Cabello
 * @license   {@link https://opensource.org/licenses/MIT|MIT License}
 */
import Phaser from 'phaser';
import {Machine, interpret} from 'xstate';
import {FSM_XSTATE, FSM_OPTIONS} from './state_configuration.js';
import {PlayerSprite} from './sprite.js';
import playerPNG from 'url:./assets/king.png';

export default class PlayerPlugin extends Phaser.Plugins.ScenePlugin {
    sprite = null;
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

    create(config) {
        if(this.sprite === null){
            const {x, y} = config;
            this.sprite = new PlayerSprite(this.scene, x, y);
            FSM_XSTATE['context']['player'] = this.sprite;
            this.machine = new Machine(FSM_XSTATE, FSM_OPTIONS);
            this.interpret = interpret(this.machine);

            // this.interpret.onTransition(state => {
            //     if (state.changed) {
            //         console.log(state.value);
            //     }
            // });

            this.interpret.start();
        }

        return this.sprite;
    }

    send(event) {
        this.interpret.send(event);
    }
}
