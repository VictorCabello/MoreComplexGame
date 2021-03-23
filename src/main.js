import Phaser from 'phaser';
import map from './assets/tilde/level1.json';
import tiles from 'url:./assets/img/generic_platformer_tiles.png';
import playerPNG from 'url:./assets/img/king.png';

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 640,
    debug: true,
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
    this.load.spritesheet({
        key: 'player',
        url: playerPNG,
        frameConfig: {
            frameWidth: 32,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 23
        }
    });
    this.load.image('tiles', tiles);
    this.load.tilemapTiledJSON('map', map);
}

function create () {
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('generic', 'tiles');

    map.createLayer('background', tileset, 0, 0);
    const platforms = map.createLayer('platform', tileset, 0, 0);
    platforms.setCollisionByExclusion(-1, true);

    this.player = this.physics.add.sprite(50, 300, 'player');
    this.player.setBounce(0.1);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, platforms);
}
