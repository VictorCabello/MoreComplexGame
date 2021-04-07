/**
 * @author    Victor Cabello <vmeca87@gmail.com>
 * @copyright 2021 Victor Cabello
 * @license   {@link https://opensource.org/licenses/MIT|MIT License}
 */
import Phaser from 'phaser';
import {Machine, interpret} from 'xstate';
import {FSM_XSTATE, FSM_OPTIONS} from './state_configuration.js';
import {PlayerSprite} from './sprite.js';
import { FireBallSprite } from '../mobs/sprites/fireball';

export default class PlayerPlugin extends Phaser.Plugins.ScenePlugin {
    sprite = null;

    create(config) {
        if(this.sprite === null){
            const {x, y} = config;
            this.sprite = new PlayerSprite(this.scene, x, y);
            FSM_XSTATE['context']['player'] = this;
            this.machine = new Machine(FSM_XSTATE, FSM_OPTIONS);
            this.interpret = interpret(this.machine);

            this.interpret.start();

            this.scene.physics.add.group({ gravityY: 0 });
 
            this.fireball = new FireBallSprite(this.scene, 100, 100);

            this.spells = this.scene.physics.add.group({
                allowGravity: false,
                immovable: true,
                visible: false
            });

            this.spells.add(this.fireball);
        }

        return this.sprite;
    }

    send(event) {
        this.interpret.send(event);
        this.fireball.send(event);
    }
}
