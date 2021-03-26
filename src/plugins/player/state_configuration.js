/**
 * @author    Victor Cabello <vmeca87@gmail.com>
 * @copyright 2021 Victor Cabello
 * @license   {@link https://opensource.org/licenses/MIT|MIT License}
 */

export const FSM_XSTATE = {
    id: 'playerControlFSM',
    initial: 'idle',
    context: {
        speed_move_air: 100,
        speed_move_x_ground: 100,
        speed_move_x_air: 100,
        speed_jump: -150,
    },
    states: {
        idle: {
            on: {
                MOVE:       'walking',
                JUMP_MOVE:  'jumping',
                JUMP:       'jumping'
            },
            onEntry: ['playIdle', 'stop']
        },
        walking: {
            on: {
                STOP: 'idle',
                JUMP: 'jumping',
                MOVE: { actions: [ 'move' ] },
                JUMP_MOVE: 'jumping'
            },
            onEntry: ['playWalk', 'move']
        },
        jumping: {
            on: {
                JUMP_MOVE: [
                    { cond: 'isOnGround', target: 'walking'},
                    { cond: 'isOnAir',    actions: 'moveOnAir' }
                ],
                JUMP: [
                    {cond: 'isOnGround',  target: 'jumping' },
                ],
                MOVE: [
                    { cond: 'isOnGround', target: 'walking',},
                    { cond: 'isOnAir',    actions: ['moveOnAir'], }
                ],
                STOP: {cond: 'isOnGround', target: 'idle',}
            },
            onEntry: ['playJump', 'jump']
        }
    }
};

export const FSM_OPTIONS={
    actions: {
        moveOnAir: function(context, event) {
            const player = context.player;
            const speed = context.speed_move_x_air;
            const velocity = player.flipX ? -1 * speed: speed;
            player.setVelocityX(velocity);
        },
        move: function(context, event){
            const player = context.player;
            const speed = context.speed_move_x_ground;
            const velocity = player.flipX ? -1 * speed: speed;
            player.setVelocityX(velocity);
        },
        stop: function(context, event){
            context.player.setVelocityX(0);
        },
        jump: function(context, event){
            const speed = context.speed_jump;
            context.player.setVelocityY(speed);
        },
        playIdle: function(context, event){
            context.player.anims.play('idle');
        },
        playWalk: function(context, event){
            context.player.anims.play('walk');
        },
        playJump: function(context, event){
            context.player.anims.play('jump');
        },
    },
    guards: {
        isOnGround: function(context, event) {
            return context.player.body.blocked.down;
        },
        isOnAir: function(context, event) {
            return !context.player.body.blocked.down;
        }
    }
};
