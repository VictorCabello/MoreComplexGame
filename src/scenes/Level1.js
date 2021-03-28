/**
 * @author    Victor Cabello <vmeca87@gmail.com>
 * @copyright 2021 Victor Cabello
 * @license   {@link https://opensource.org/licenses/MIT|MIT License}
 */
import Phaser from 'phaser';
import PlayerPlugin from '../plugins/player/main.js';
import MapLevel01Plugin from '../plugins/Level1.js';
import WinPlugin from '../plugins/win.js';
import ControlPlugin from '../plugins/control.js';

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
        this.load.scenePlugin({
            key: 'WinPlugin',
            url: WinPlugin,
            sceneKey: 'win'
        });
        this.load.scenePlugin({
            key: 'ControlPlugin',
            url: ControlPlugin,
            sceneKey: 'control'
        });
    }

    create () {
        const platforms = this.map.create();
        const player =
              this.player.create(this.map.getGameObject('playerStart'));

        this.win.create(this.map.getGameObject('win'));

        this.physics.add.collider(player, platforms);
    }

    update () {
        const sprite = this.player.sprite;

        this.control.update(this.player);
        this.win.update(sprite);
    }
}
