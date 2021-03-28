import Phaser from 'phaser';

export default class YouWin extends Phaser.Scene {
    constructor(){
        super('you-win');
    }

    create(){
        const {width, height}  = this.scale;

        const x = width * 0.5;
        const y = height * 0.5;

        this.add.text(x, y, 'You Win!', {
            fontSize: '32px',
            color: '#FFF',
            backgroundColor: '#000',
            shadow: { fill: true, blur: 0, offsetY:0 },
            padding: { left: 15, right: 15, top: 0, bottom: 10 }
        })
        .setOrigin(0.5);
    }
}
