import Phaser from 'phaser';
import map from './assets/tilde/level1.json';
import tiles from 'url:./assets/img/generic_platformer_tiles.png';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 640,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('tiles', tiles);
    this.load.tilemapTiledJSON('map', map);
}

function create () {
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('generic', 'tiles');

    const background = map.createLayer('background', tileset, 0, 0);
    const palftom = map.createLayer('platform', tileset, 0, 0);
}
