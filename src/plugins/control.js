/**
 * @author    Victor Cabello <vmeca87@gmail.com>
 * @copyright 2021 Victor Cabello
 * @license   {@link https://opensource.org/licenses/MIT|MIT License}
 */
import Phaser from 'phaser';

export default class ControlPlugin extends Phaser.Plugins.ScenePlugin {

    boot () {
        this.keys = this.scene.input.keyboard.createCursorKeys();
    }

    update ( player ) {
        player.send(this.getEvents());
    }

    getEvents() {
        let inputs = {};
        Object.keys(this.keys).forEach(k => {
            inputs[k] = this.keys[k].isDown;
        });
        const events = [];
        const {left, right, up} = inputs;
        if(left){events.push('LEFT');}
        if(right){events.push('RIGHT');}
        if(up){events.push('UP');}
        if(!(left || right|| up)) {events.push('STOP');}


        return events;
    }
}
