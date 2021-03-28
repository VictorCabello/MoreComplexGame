/**
 * @author    Victor Cabello <vmeca87@gmail.com>
 * @copyright 2021 Victor Cabello
 * @license   {@link https://opensource.org/licenses/MIT|MIT License}
 */
import Phaser from 'phaser';

export default class WinPlugin extends Phaser.Plugins.ScenePlugin {

    create ( winArea ) {
        const { x, y, width, height} = winArea;
        this.win = new Phaser.Geom.Rectangle(x, y, width, height);
    }

    update ( sprite ) {
        if( this.win.contains(
            sprite.x + (sprite.width / 2),
            sprite.y + (sprite.height / 2)) ) {
            this.scene.scene.run('you-win');
        }
    }
}
