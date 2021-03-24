/**
 * @author    Victor Cabello <vmeca87@gmail.com>
 * @copyright 2021 Victor Cabello
 * @license   {@link https://opensource.org/licenses/MIT|MIT License}
 */
import Phaser from 'phaser';
import PlayerPlugin from '../plugins/Player.js'
import MapLevel01Plugin from '../plugins/Level1.js'

/**
 * Class that represent the first level of the game.
 *
 * @class
 * @name MoreComplexGame.Level1
 * @since 1.0.0
 */
export default class Level1 extends Phaser.Scene {

    /**
     * Plugin that handles all the player animations
     *
     * @name player
     * @type {MoreComplexGame.PlayerPlugin}
     */
    player;

    /**
     * Plugin that handles all the player animations
     *
     * @name map
     * @type {MoreComplexGame.MapLevel01Plugin}
     */
    map;

    actions = {};

    /**
     * This function load the main plugins for the scene, which include
     * the following:
     *
     * 1) {@link player}
     * 2) {@link map}
     *
     * @see Phaser.Types.Scenes.ScenePreloadCallback preload()
     * @see MoreComplexGame.MapLevel01Plugin
     * @see MoreComplexGame.PlayerPlugin
     */
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

    /**
     * Crete all the componts for the map, player and the collisions between them.
     *
     * @see Phaser.Types.Scenes.ScenePreloadCallback create()
     */
    create () {

        const platforms = this.map.create();
        const player = this.player.create(10, 300);

        this.physics.add.collider(player, platforms);
        this.keys = this.input.keyboard.createCursorKeys();
    }

    update () {
        Object.keys(this.keys).forEach(k => {
            this.actions[k] = this.keys[k].isDown;
        });

        this.player.step(this.actions)
    }
}
