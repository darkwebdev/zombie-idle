import { addComponent, addEntity } from 'bitecs';
import { Damage, Input, Player, Position, Size, Skills, Sprite, Stats, Velocity } from '../components';
import { Sprites } from '../const';

const initialZombieState = {
    width: 50,
    height: 150,
    x: 100,
    y: 450,
    velocity: 5,
    // Stats
    hp: 10,
    maxHp: 10,
    attackSpeed: 1,
    hitChance: 50,
    criticalChance: 30,
    criticalDamage: 300,
    // Skills
    attack: 1,
    crowdAttack: 1,
    rangedAttack: 0,
};


export const respawnZombie = entity => {
    Position.x[entity] = initialZombieState.x;
    Position.y[entity] = initialZombieState.y;
    Size.width[entity] = initialZombieState.width;
    Size.height[entity] = initialZombieState.height;
    Velocity.x[entity] = initialZombieState.velocity;

    Stats.hp[entity] = initialZombieState.hp;
    Stats.maxHp[entity] = initialZombieState.maxHp;
    Stats.attackSpeed[entity] = initialZombieState.attackSpeed;
    Stats.hitChance[entity] = initialZombieState.hitChance;
    Stats.criticalChance[entity] = initialZombieState.criticalChance;
    Stats.criticalDamage[entity] = initialZombieState.criticalDamage;

    Skills.attack[entity] = [initialZombieState.attack, 0];
    Skills.crowdAttack[entity] = [initialZombieState.crowdAttack, 0];
    Skills.rangedAttack[entity] = [initialZombieState.rangedAttack, 0];

    Sprite.texture[entity] = Sprites.Zombie;
};

export const createZombie = scene => {
    createZombieAnims(scene.anims);
    return addZombieEntity(scene.world);
}

export const addZombieEntity = world => {
    const zombie = addEntity(world);

    addComponent(world, Position, zombie);
    addComponent(world, Size, zombie);
    addComponent(world, Velocity, zombie);
    addComponent(world, Stats, zombie);
    addComponent(world, Skills, zombie);
    addComponent(world, Damage, zombie);
    addComponent(world, Sprite, zombie);
    addComponent(world, Player, zombie);
    addComponent(world, Input, zombie);

    return zombie;
};

export const loadZombieAtlas = scene => {
    scene.load.atlas('zombie', 'assets/zombie.png', 'assets/zombie.json');
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
        frameRate: 16
    });
};

export const ATTACK_HIT_FRAME = 4;

////  Here we just pass the texture atlas key to `create` and it will extract all frames
//         //  from within it, numerically sorting them for the animation.
//         this.anims.create({
//             key: 'walk',
//             frames: 'zombie',
//             frameRate: 12,
//             repeat: -1
//         });
