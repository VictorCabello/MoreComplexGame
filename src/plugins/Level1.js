/**
 * @author    Victor Cabello <vmeca87@gmail.com>
 * @copyright 2021 Victor Cabello
 * @license   {@link https://opensource.org/licenses/MIT|MIT License}
 */
import Phaser from 'phaser';
import map from '../assets/tilde/level1.json';
import tiles from 'url:../assets/img/generic_platformer_tiles.png';

export default class MapLevel01Plugin extends Phaser.Plugins.ScenePlugin {

    platforms = null;

    boot() {
        this.scene.load.image('tiles', tiles);
        this.scene.load.tilemapTiledJSON('map', map);
    }

    create() {
        if(this.platforms === null){
            this.map = this.scene.make.tilemap({ key: 'map' });
            const tileset = this.map.addTilesetImage('generic', 'tiles');

            this.createBackground(tileset);
            this.platforms = this.createPlaforms(tileset);
        }

        return this.platforms;
    }

    createBackground(tileset) {
        this.map.createLayer('background', tileset, 0, 0);
    }

    createPlaforms(tileset) {
        const platforms = this.map.createLayer('platform', tileset, 0, 0);
        platforms.setCollisionByExclusion(-1, true);
        return platforms;
    }

    getGameObject(name){
        const layer = this.map.getObjectLayer('GameObjects');
        const wanted = layer.objects.find((element) => element.name === name);
        if(wanted) { return wanted; }
        else {throw  name + ' not found in GameObjects'}
    }
}
