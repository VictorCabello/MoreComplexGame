/**
 * @author    Victor Cabello <vmeca87@gmail.com>
 * @copyright 2021 Victor Cabello
 * @license   {@link https://opensource.org/licenses/MIT|MIT License}
 */
import Phaser from 'phaser';
import {Machine, interpret} from 'xstate';
// ------------------------------------------------------
//
// S T A T E - M A C H I N E - C O N F I G U R A T I O N
// ------------------------------------------------------
const FSM_XSTATE = {
    id: 'playerControlFSM',
    initial: 'idle',
    context: {
        player: null
    },
    states: {
        idle: {
            on: {
                MOVE: 'walking',
                JUMP_MOVE: 'jumping',
                JUMP: 'jumping'
            },
            onEntry: function(context, event){
                if(!event.player){ return; }
                event.player.sprite.setVelocityX(0);
                event.player.idle();
            }
        },
        walking: {
            on: {
                STOP: 'idle',
                JUMP: 'jumping',
                MOVE: 'walking',
                JUMP_MOVE: 'jumping'
            },
            onEntry: function(context, event){
                const player = event.player;
                const velocity = player.sprite.flipX ? -100: 100;
                player.sprite.setVelocityX(velocity);
                player.walk();
            }
        },
        jumping: {
            always: [{
                target: 'moving_air',
            }],
            onEntry: function(context, event){
                event.player.sprite.setVelocityY(-150);
                event.player.jump();
            }
        },
        moving_air: {
            on: {
                JUMP_MOVE: [
                    {target: 'walking', cond: 'onGround'},
                    {
                        actions: ['moveOnAir'],
                        cond: 'onAir'
                    }
                ],
                JUMP: [
                    {target: 'idle', cond: 'onGround'},
                    {
                        actions: ['moveOnAir'],
                        cond: 'onAir'
                    }
                ],
                MOVE: {
                    target: 'walking',
                    cond: 'onGround'
                },
                STOP: {
                    target: 'idle',
                    cond: 'onGround'
                }
            },
        }
    }
}
// ------------------------------------------------------
//
// S T A T E - M A C H I N E - O P T I O N S
// ------------------------------------------------------
const FSM_OPTIONS={
    actions: {
        moveOnAir: function(contex, event) {
            const player = event.player;
            const velocity = player.sprite.flipX ? -100: 100;
            player.sprite.setVelocityX(velocity);
        }
    },
    guards: {
        onGround: function(contex, event) {
            if(! event.player){ return true; }
            const player = event.player;
            return player.sprite.body.blocked.down;
        },
        onAir: function(contex, event) {
            const player = event.player;
            return ! player.sprite.body.blocked.down;
        }
    }
}
/**
 * Plugin to control the player behavior.
 *
 * @class
 * @name MoreComplexGame.PlayerPlugin
 */
export default class PlayerControllerPlugin extends Phaser.Plugins.ScenePlugin {

    /**
     * State machine to handle of the player behavior.
     */
    machine = null;


    /**
     * Create a state machine to handle of the player behavior.
     */
    boot() {
        this.machine = new Machine(FSM_XSTATE, FSM_OPTIONS);
        this.interpret = interpret(this.machine);
        this.interpret.start();
    }

    /**
     * Send events to the state machine based on the inputs.
     *
     * @param inputs {Object} all the inputs that on the control
    * @param input {Object} the player plugin that handle all the graphics.
     */
    send(inputs, player){
        const {left, right, up} = inputs;

        // handle direcction
        if(left) {player.sprite.setFlipX(true);}
        if(right){player.sprite.setFlipX(false);}

        let event = (left || right)? 'MOVE':'STOP';
        event = (up)? 'JUMP': event;
        event = (up) && (left || right)? 'JUMP_MOVE': event;

        this.interpret.send({
            type: event,
            player: player,
            inputs: inputs
        });
    }

}
