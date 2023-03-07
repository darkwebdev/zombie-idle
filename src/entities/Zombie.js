import { addComponent, addEntity } from 'bitecs';
import { AttackedMelee, Damage, Input, Player, Position, Size, Sprite, Stats, Velocity } from '../components';
import { Sprites } from '../const';

const initialZombieState = {
    width: 100,
    height: 300,
    x: 100,
    y: 450,
    velocity: 5,
    hp: 10,
    maxHp: 10,
    attack: 10,
    attackSpeed: 1,
    hitChance: 50,
};

export const respawnZombie = entity => {
    Position.x[entity] = initialZombieState.x;
    Position.y[entity] = initialZombieState.y;
    Size.width[entity] = initialZombieState.width;
    Size.height[entity] = initialZombieState.height;
    Velocity.x[entity] = initialZombieState.velocity;
    Stats.hp[entity] = initialZombieState.hp;
    Stats.maxHp[entity] = initialZombieState.maxHp;
    Stats.attack[entity] = initialZombieState.attack;
    Stats.attackSpeed[entity] = initialZombieState.attackSpeed;
    Stats.hitChance[entity] = initialZombieState.hitChance;
    Sprite.texture[entity] = Sprites.Zombie;
};

export const addZombieEntity = world => {
    const zombie = addEntity(world);

    addComponent(world, Position, zombie);
    addComponent(world, Size, zombie);
    addComponent(world, Velocity, zombie);
    addComponent(world, Stats, zombie);
    addComponent(world, Damage, zombie);
    addComponent(world, AttackedMelee, zombie);
    addComponent(world, Sprite, zombie);
    addComponent(world, Player, zombie);
    addComponent(world, Input, zombie);

    return zombie;
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
