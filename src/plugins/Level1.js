/**
 * @author    Victor Cabello <vmeca87@gmail.com>
 * @copyright 2021 Victor Cabello
 * @license   {@link https://opensource.org/licenses/MIT|MIT License}
 */
import Phaser from 'phaser';
import map from '../assets/tilde/level1.json';
import tiles from 'url:../assets/img/generic_platformer_tiles.png';

export default class MapLevel01Plugin extends Phaser.Plugins.ScenePlugin {

    boot() {
        this.scene.load.image('tiles', tiles);
        this.scene.load.tilemapTiledJSON('map', map);
    }

    create() {
        if(! this.platforms){
            this.map = this.scene.make.tilemap({ key: 'map' });
            const tileset = this.map.addTilesetImage('generic', 'tiles');

            this.createBackground(tileset);
            this.platforms = this.createPlaforms(tileset);

            this.initWin(this.getGameObject('win'));
            this.initDieAreas(this.getObjectByType('die'));
        }

        return this.platforms;
    }

    update ( sprite ) {
        if( this.checkContains(this.win, sprite) ) {
            this.scene.scene.run('you-win');
        }
        else if (
            this.dieAreas.some((area) => this.checkContains(area, sprite)) ){
            this.scene.scene.run('you-lose');
        }
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
        else { throw  name + ' not found in GameObjects'; }
    }

    getObjectByType ( type ) {
        const layer = this.map.getObjectLayer('GameObjects');
        return layer.objects.filter((element) => element.type === type);
    }

    initWin ( winArea ){
        this.win = this.initFrame(winArea);
    }

    initDieAreas ( dieAreas ){
        this.dieAreas = [];
        for (var i = 0; i < dieAreas.length; ++i) {
            this.dieAreas.push(this.initFrame(dieAreas[i]));
            
        }
    }

    initFrame ( frame ) {
        let { x, y, width, height} = frame;
        //const myReturn = this.scene.add.rectangle(x, y, width, height,0xff6692);
        return new Phaser.Geom.Rectangle(x, y, width, height);
    }

    checkContains ( frame, sprite ) {
        return frame.contains(
            sprite.x + (sprite.width / 2),
            sprite.y + (sprite.height / 2));
    }
}
