export const initialCowboyState = {
    width: 100,
    height: 300,
    x: 600,
    y: 450,
    hp: 25,
    maxHp: 25,
    attack: 1,
    attackSpeed: 1,
};

export const createCowboyAnims = (anims) => {
    anims.create({
        key: 'cowboyIdle',
        frames: anims.generateFrameNames('cowboy', {
            prefix: 'cowboy/idle_', suffix: '.png',
            zeroPad: 5,
            start: 1, end: 10,
        }),
        repeat: -1,
        frameRate: 12
    });
    anims.create({
        key: 'cowboyDead',
        frames: anims.generateFrameNames('cowboy', {
            prefix: 'cowboy/dead_', suffix: '.png',
            zeroPad: 5,
            start: 1, end: 10,
        }),
        repeat: 0,
        frameRate: 12
    });
}
