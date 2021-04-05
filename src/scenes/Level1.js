/**
 * @author    Victor Cabello <vmeca87@gmail.com>
 * @copyright 2021 Victor Cabello
 * @license   {@link https://opensource.org/licenses/MIT|MIT License}
 */
import Phaser from 'phaser';
import PlayerPlugin from '../plugins/player/main.js';
import MapLevel01Plugin from '../plugins/map.js';
import ControlPlugin from '../plugins/control.js';

import atlasPNG from 'url:../assets/img/texture.png';
import atlasJSON from 'url:../assets/img/texture.json';

export default class Level1 extends Phaser.Scene {

    preload () {
        this.load.atlas(
            'atlas',
            atlasPNG,
            atlasJSON
        );
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
            key: 'ControlPlugin',
            url: ControlPlugin,
            sceneKey: 'control'
        });
    }

    create () {
        const platforms = this.map.create();
        const sprite =
              this.player.create(this.map.getGameObject('playerStart'));
        
        this.map.add(sprite);

    }

    update () {
        const sprite = this.player.sprite;

        this.control.update(this.player);
        this.map.update(sprite);
    }
}
