export const initialZombieState = {
    width: 100,
    height: 200,
    x: 100,
    y: 450,
    velocity: 5,
    hp: 10,
    maxHp: 10,
    attack: 1,
    attackSpeed: 1,
};

export const createZombieAnims = (anims) => {
    anims.create({
        key: 'zombieIdle',
        frames: anims.generateFrameNames('zombie', {
            prefix: 'zombie/idle_', suffix: '.png',
            start: 1, end: 8,
        }),
        yoyo: true,
        repeat: -1,
        frameRate: 12
    });
    anims.create({
        key: 'zombieWalk',
        frames: anims.generateFrameNames('zombie', {
            prefix: 'zombie/walk_', suffix: '.png',
            start: 1, end: 10,
        }),
        repeat: -1,
        frameRate: 12
    });
    anims.create({
        key: 'zombieAttack',
        frames: anims.generateFrameNames('zombie', {
            prefix: 'zombie/attack_', suffix: '.png',
            start: 1, end: 8,
        }),
        repeat: -1,
        frameRate: 12
    });
}
