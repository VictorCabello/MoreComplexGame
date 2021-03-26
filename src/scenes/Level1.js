/**
 * @author    Victor Cabello <vmeca87@gmail.com>
 * @copyright 2021 Victor Cabello
 * @license   {@link https://opensource.org/licenses/MIT|MIT License}
 */
import Phaser from 'phaser';
import PlayerPlugin from '../plugins/player/main.js';
import MapLevel01Plugin from '../plugins/Level1.js';

export default class Level1 extends Phaser.Scene {

    preload () {
        this.load.scenePlugin({
            key: 'MapLevel01Plugin',
            url: MapLevel01Plugin,
            sceneKey: 'map'
        });
        this.load.scenePlugin({
            key: 'PlayerPlugin',
            url: PlayerPlugin,
            sceneKey: 'player'
        });
    }

    create () {

        const platforms = this.map.create();
        const playerStart = this.map.getGameObject('playerStart');
        const player = this.player.create(
            playerStart.x,
            playerStart.y
        );

        this.physics.add.collider(player, platforms);
        this.keys = this.input.keyboard.createCursorKeys();
    }

    update () {
        const events = this.getEvents();
        this.player.send(events);
    }

    getEvents() {
        let inputs = {};
        Object.keys(this.keys).forEach(k => {
            inputs[k] = this.keys[k].isDown;
        });
        const events = [];
        const {left, right, up} = inputs;
        if(left){events.push('LEFT');}
        if(right){events.push('RIGHT');}
        if(up){events.push('UP');}
        if(!(left || right|| up)) {events.push('STOP');}


        return events;
    }
}
