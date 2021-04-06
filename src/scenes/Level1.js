/**
 * @author    Victor Cabello <vmeca87@gmail.com>
 * @copyright 2021 Victor Cabello
 * @license   {@link https://opensource.org/licenses/MIT|MIT License}
 */
import Phaser from 'phaser';
import PlayerPlugin from '../plugins/player';
import MapPlugin from '../plugins/map.js';
import ControlPlugin from '../plugins/control.js';

import atlasPNG from 'url:../assets/img/texture.png';
import atlasJSON from 'url:../assets/img/texture.json';
import map from '../assets/tilde/level1.json';
import tiles from 'url:../assets/img/generic_platformer_tiles.png';

import { LEVEL_01_TILEMAP_NAME } from '../constant';

const TILESET_NAME = 'generic';
const TILESET_SRC = 'tiles';
export default class Level1 extends Phaser.Scene {

    preload() {
        this.loadAssets();
        this.loadPlugins();
    }

    create() {
        const tilesetDic = {}
        tilesetDic[TILESET_NAME] = TILESET_SRC
        this.map.create(LEVEL_01_TILEMAP_NAME, tilesetDic);
    }

    update() {
        this.control.update(this.player);
    }

    loadAssets() {
        this.load.image(TILESET_SRC, tiles);
        this.load.tilemapTiledJSON(LEVEL_01_TILEMAP_NAME, map);
        this.load.atlas(
            'atlas',
            atlasPNG,
            atlasJSON
        );
    }

    loadPlugins() {
        this.load.scenePlugin({
            key: 'MapLevel01Plugin',
            url: MapPlugin,
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
}
