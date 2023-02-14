import { Scene } from 'phaser';

export class IdleZombie extends Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.image('sky', 'assets/bg/1/Night/1.png');
        for (let line = 0; line < 4; line++) {
            // if (line === 3) continue;
            for (let screen = 0; screen < 8; screen++) {
                this.load.image(`building${line}${screen}`, `assets/bg/${screen + 1}/Night/${line + 2}.png`);
            }
        }
        this.load.atlas('zombie', 'assets/zombie.png', 'assets/zombie.json');

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create() {
        const { width, height } = this.scale;
        const imgWidth = this.textures.get('sky').getSourceImage().width;
        const imgHeight = this.textures.get('sky').getSourceImage().height;

        const sky = this.add
            .tileSprite(0, 0, width, imgHeight, 'sky')
            .setOrigin(0, 0)
            .setScrollFactor(0);
        const buildings = [];
        for (let line = 0; line < 4; line++) {
            buildings.push([]);
            for (let screen = 0; screen < 8; screen++) {
                const building = this.add
                    .sprite(imgWidth * screen, 0, `building${line}${screen}`)
                    .setOrigin(0, 0)
                    .setScrollFactor((line+1)*0.25);
                buildings[line].push(building);
            }
        }

        this.anims.create({
            key: 'zombieIdle',
            frames: this.anims.generateFrameNames('zombie', {
                prefix: 'zombie/idle_', suffix: '.png',
                start: 1, end: 8,
            }),
            yoyo: true,
            repeat: -1,
            frameRate: 12
        });
        this.anims.create({
            key: 'zombieWalk',
            frames: this.anims.generateFrameNames('zombie', {
                prefix: 'zombie/walk_', suffix: '.png',
                start: 1, end: 10,
            }),
            repeat: -1,
            frameRate: 12
        });
        this.zombie = this.add
            .sprite(100, 300, 'zombie')
            .setScale(0.5)
            .setScrollFactor(0)
            .play('zombieIdle');

        // this.cameras.main.startFollow(this.zombie);
    }

    update(/*time, delta*/) {
        // super.update(time, delta);
        const cam = this.cameras.main;
        const speed = 3;
        switch (true) {
            // case this.cursors.left.isDown:
            //     cam.scrollX -= speed;
            //     break;
            case this.cursors.right.isDown:
                cam.scrollX += speed;
                this.zombie.play('zombieWalk', true);
                break;
            case this.cursors.right.isUp:
                this.zombie.play('zombieIdle', true);
                break;
        }
    }
}
