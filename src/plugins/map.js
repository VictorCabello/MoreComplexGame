/**
 * @author    Victor Cabello <vmeca87@gmail.com>
 * @copyright 2021 Victor Cabello
 * @license   {@link https://opensource.org/licenses/MIT|MIT License}
 */
import Phaser from 'phaser';
import { SnakeSprite } from '../plugins/mobs/sprites/snake.js';
import {SCENE_GAME_OVER, SCENE_WIN} from '../constant.js';

const NAME_WIN_AREA = 'win';
const DIE_AREA = 'die';
const MOBS = 'snake';
const MOBS_WALL = 'mobWall';
const BACKGROUN_LAYER = 'background';
const PLATFROM_LAYER = 'platform';
const PLAYER_START_AREA = 'playerStart';
const GAME_OBJECT_LAYER = 'GameObjects';
const MOBS_LAYER = 'mobs';
export default class MapPlugin extends Phaser.Plugins.ScenePlugin {

    create(tilemapName, tilesetNames) {
        this.initAssets(tilemapName, tilesetNames);

        this.createBackground();
        this.createPlaforms();

        this.initWinArea();
        this.initDieAreas();
        this.initMobs();

        this.initPlayer();
    }

    initAssets(tilemapName, tilesetNames) {
        this.tilemap = this.scene.make.tilemap({ key: tilemapName });
        this.tileset = [];

        for (const [key, value] of Object.entries(tilesetNames)) {
            this.tileset.push(this.tilemap.addTilesetImage(key, value));
        }
    }

    win() {
        this.scene.scene.run(SCENE_WIN);
    }

    lose() {
        this.scene.scene.run(SCENE_GAME_OVER);
    }

    createBackground() {
        this.tilemap.createLayer(BACKGROUN_LAYER, this.tileset, 0, 0);
    }

    createPlaforms() {
        const platforms = this.tilemap.createLayer(PLATFROM_LAYER, this.tileset, 0, 0);
        platforms.setCollisionByExclusion(-1, true);
        this.platforms = platforms;
    }

    initWinArea() {
        const { x, y, width, height } = this.getGameObject(NAME_WIN_AREA);
        this.winArea = this.scene.physics.add.group({
            allowGravity: false,
            immovable: true,
            visible: false

        });
        const rectangle = this.scene.add.rectangle(
            x, y, width, height).setOrigin(0);
        this.winArea.add(rectangle);
    }

    initDieAreas() {
        const scene = this.scene;
        const areasFromMap = this.getObjectByType(DIE_AREA);
        this.dieAreas = scene.physics.add.group({
            allowGravity: false,
            immovable: true,
            visible: false

        });
        areasFromMap.forEach(area => {
            const { x, y, width, height } = area;
            const rectangle = scene.add.rectangle(x, y, width, height).setOrigin(0);
            this.dieAreas.add(rectangle);
        });
    }

    initMobs() {
        const mobs = this.getMobByType(MOBS);
        const mobWall = this.getMobByType(MOBS_WALL);
        const scene = this.scene;
        const snakes = scene.physics.add.group({
            collideWorldBounds: true,
            classType: SnakeSprite
        });
        const wallMobsGroup = scene.physics.add.group({
            allowGravity: false,
            immovable: true,
            visible: false

        });

        mobs.forEach(mob => {
            snakes.get(mob.x, mob.y - 20);
        });
        mobWall.forEach(area => {
            const { x, y, width, height } = area;
            const rectangle = scene.add.rectangle(x, y, width, height);
            rectangle.setOrigin(0);
            wallMobsGroup.add(rectangle);
        });

        scene.physics.world.on(Phaser.Physics.Arcade.Events.WORLD_BOUNDS, (body) => {
            const gameObject = body.gameObject;
            if (gameObject instanceof SnakeSprite) {
                gameObject.destroy();
            }
        });

        scene.physics.add.collider(snakes, this.platforms);
        scene.physics.add.collider(snakes, wallMobsGroup);
        this.snakes = snakes;
    }

    initPlayer() {
        const scene = this.scene;
        if (!scene.player) {
            throw 'PlayerPlugin is not loaded in scene ' + scene.name;
        }
        scene.player.create(this.getGameObject(PLAYER_START_AREA));
        const player = scene.player.sprite;
        scene.physics.add.collider(this.snakes,
            player,
            () => true,
            this.lose,
            this);
        scene.physics.add.collider(player, this.platforms);
        scene.physics.add.overlap(this.dieAreas,
            player,
            () => true,
            this.lose,
            this);
        scene.physics.add.overlap(this.winArea,
            player,
            () => true,
            this.win,
            this);
    }

    getGameObject(name) {
        const layer = this.tilemap.getObjectLayer(GAME_OBJECT_LAYER);
        const wanted = layer.objects.find((element) => element.name === name);
        if (wanted) { return wanted; }
        else { throw name + ' not found in ' + GAME_OBJECT_LAYER; }
    }

    getObjectByType(type) {
        const layer = this.tilemap.getObjectLayer(GAME_OBJECT_LAYER);
        return layer.objects.filter((element) => element.type === type);
    }

    getMobByType(type) {
        const layer = this.tilemap.getObjectLayer(MOBS_LAYER);
        return layer.objects.filter((element) => element.type === type);
    }
}
