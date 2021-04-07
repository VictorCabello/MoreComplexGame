/**
 * @author    Victor Cabello <vmeca87@gmail.com>
 * @copyright 2021 Victor Cabello
 * @license   {@link https://opensource.org/licenses/MIT|MIT License}
 */

export const FSM_XSTATE = {
    id: 'playerControlFSM',
    initial: 'idle',
    context: {
        speed_move_x_ground: 100,
        speed_jump: -150,
    },
    states: {
        idle: {
            on: {
                RIGHT: { target: 'walking',actions: 'right' },
                LEFT:  { target: 'walking',actions: 'left' },
                UP:  'jumping',
                CAST: 'casting'
            },
            onEntry: ['playIdle', 'stop']
        },
        walking: {
            on: {
                RIGHT: { actions: ['right', 'move'] },
                LEFT:  { actions: ['left', 'move'] },
                STOP: 'idle',
                UP: 'jumping',
                CAST: 'casting'
            },
            onEntry: ['playWalk', 'move']
        },
        jumping: {
            on: {
                RIGHT: [
                    { cond: 'isOnGround', target: 'walking'},
                    { cond: 'isOnAir', actions: ['right', 'move'] },
                ],
                LEFT: [
                    { cond: 'isOnGround', target: 'walking'},
                    { cond: 'isOnAir', actions: ['left', 'move'] },
                ],
                UP: [
                    {cond: 'isOnGround',  target: 'idle' },
                ],
                STOP: {cond: 'isOnGround', target: 'idle',},
                CAST: 'casting'
            },
            onEntry: ['playJump', 'jump']
        },
        casting: {
            on: {
                RIGHT: [
                    { cond: 'isOnGround', target: 'walking'},
                    { cond: 'isOnAir', actions: ['right', 'move'] },
                ],
                LEFT: [
                    { cond: 'isOnGround', target: 'walking'},
                    { cond: 'isOnAir', actions: ['left', 'move'] },
                ],
                UP: [
                    {cond: 'isOnGround',  target: 'idle' },
                ],
                STOP: {cond: 'isOnGround', target: 'idle',},
            },
            onEntry: ['casting']
        }
    }
};

export const FSM_OPTIONS={
    actions: {
        move: function(context, event){
            const player = context.player.sprite;
            const speed = context.speed_move_x_ground;
            const velocity = player.flipX ? -1 * speed: speed;
            player.setVelocityX(velocity);
        },
        left:  function(context, event){
            context.player.sprite.setFlipX(true);
        },
        right:  function(context, event){
            context.player.sprite.setFlipX(false);
        },
        stop: function(context, event){
            context.player.sprite.setVelocityX(0);
        },
        jump: function(context, event){
            const speed = context.speed_jump;
            context.player.sprite.setVelocityY(speed);
        },
        playIdle: function(context, event){
            context.player.sprite.playIdle();
        },
        playWalk: function(context, event){
            context.player.sprite.playWalk();
        },
        playJump: function(context, event){
            context.player.sprite.playJump();
        },
        casting: function(context, event){
            context.player.fireball.send({type:'FIRE', player: context.player});
        },
    },
    guards: {
        isOnGround: function(context, event) {
            return context.player.sprite.body.blocked.down;
        },
        isOnAir: function(context, event) {
            return !context.player.sprite.body.blocked.down;
        }
    }
};
