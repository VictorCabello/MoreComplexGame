import Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
    constructor(){
        super('you-lose');
    }

    create(){
        const {width, height}  = this.scale;

        const x = width * 0.5;
        const y = height * 0.5;

        this.add.text(x, y, 'Game Over!', {
            fontSize: '32px',
            color: '#FFF',
            backgroundColor: '#000',
            shadow: { fill: true, blur: 0, offsetY:0 },
            padding: { left: 15, right: 15, top: 0, bottom: 10 }
        })
        .setOrigin(0.5);
    }
}
