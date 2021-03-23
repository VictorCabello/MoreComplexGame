/**
 * @author    Victor Cabello <vmeca87@gmail.com>
 * @copyright 2021 Victor Cabello
 * @license   {@link https://opensource.org/licenses/MIT|MIT License}
 */
import Phaser from 'phaser';
import map from '../assets/tilde/level1.json';
import tiles from 'url:../assets/img/generic_platformer_tiles.png';
/**
 * Plugin to control the map of the level 1.
 *
 * @class
 * @extends Phaser.Plugins.ScenePlugin
 * @name MoreComplexGame.MapLevel01Plugin
 */
export default class MapLevel01Plugin extends Phaser.Plugins.ScenePlugin {

    /**
     * Plugin that handles all the player animations
     *
     * @name platforms
     * @type {Phaser.Tilemaps.TilemapLayer}}
     */
    platforms = null;

    /**
     * This function load the main assets for the level01, which include
     * the following:
     *
     * 1) tiles: A PNG image that contians genaral patterns that are used on the level.
     * 2) map: The map of this level created with Tiled.
     *
     * @see Phaser.Plugins.ScenePlugin.boot()
     * @see https://www.mapeditor.org
     * @see MoreComplexGame.PlayerPlugin
     */
    boot() {
        this.scene.load.image('tiles', tiles);
        this.scene.load.tilemapTiledJSON('map', map);
    }

    /**
     * Initialize the map and return the platforms that could interact with the player.
     *
     * A tileset called "generic" should exit in the tile map.
     *
     * @return {Phaser.Tilemaps.TilemapLayer} platforms
     */
    create() {
        if(this.platforms === null){
            const map = this.scene.make.tilemap({ key: 'map' });
            const tileset = map.addTilesetImage('generic', 'tiles');

            this.createBackground(map, tileset);
            this.platforms = this.createPlaforms(map, tileset)
        }

        return this.platforms;
    }

    /**
     * Create the background.
     *
     * A layer called "background" should exit in the tile map.
     * @private
     */
    createBackground(map, tileset) {
        map.createLayer('background', tileset, 0, 0);
    }

    /**
     * Create the platform.
     *
     * A layer called "platform" should exit in the tile map.
     * @private
     * @return {Phaser.Tilemaps.TilemapLayer} platforms
     */
    createPlaforms(map, tileset) {
        const platforms = map.createLayer('platform', tileset, 0, 0);
        platforms.setCollisionByExclusion(-1, true);
        return platforms;
    }
}
