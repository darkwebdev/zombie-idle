import { addComponent, addEntity } from 'bitecs';
import { Damage, Position, Size, Sprite, Stats, Velocity } from '../components';
import { Sprites } from '../const';

export const DEAD_ANIM_ADJUST_Y = 10;
export const HIT_ANIM_ADJUST_X = 40;

const initialGuardState = {
    width: 100,
    height: 300,
    x: 600,
    y: 450,
    velocity: 1,
    // stats
    hp: 25,
    maxHp: 25,
    attackSpeed: 1,
    // skills
    attack: 1,
};

export const respawnGuard = entity => {
    Position.x[entity] = initialGuardState.x;
    Position.y[entity] = initialGuardState.y;
    Size.width[entity] = initialGuardState.width;
    Size.height[entity] = initialGuardState.height;
    Velocity.x[entity] = initialGuardState.velocity;

    Stats.hp[entity] = initialGuardState.hp;
    Stats.maxHp[entity] = initialGuardState.maxHp;
    Stats.attackSpeed[entity] = initialGuardState.attackSpeed;

    Sprite.texture[entity] = Sprites.Guard;
    Sprite.isFlipped[entity] = 1;
}

export const addGuardEntity = world => {
    const entity = addEntity(world);

    addComponent(world, Position, entity);
    addComponent(world, Velocity, entity);
    addComponent(world, Size, entity);
    addComponent(world, Stats, entity);
    addComponent(world, Damage, entity);
    addComponent(world, Sprite, entity);

    return entity;
};

export const createGuardAnims = (anims) => {
    anims.create({
        key: 'guardIdle',
        frames: anims.generateFrameNames('guard', {
            prefix: 'guard/idle_', suffix: '.png',
            zeroPad: 3,
            start: 0, end: 5,
        }),
        repeat: -1,
        frameRate: 6
    });
    anims.create({
        key: 'guardWalk',
        frames: anims.generateFrameNames('guard', {
            prefix: 'guard/walk_', suffix: '.png',
            zeroPad: 3,
            start: 0, end: 5,
        }),
        repeat: -1,
        frameRate: 6
    });
    anims.create({
        key: 'guardDead',
        frames: anims.generateFrameNames('guard', {
            prefix: 'guard/dead_', suffix: '.png',
            zeroPad: 3,
            start: 0, end: 9,
        }),
        repeat: 0,
        frameRate: 10
    });
    anims.create({
        key: 'guardHit',
        frames: anims.generateFrameNames('guard', {
            prefix: 'guard/hit_', suffix: '.png',
            zeroPad: 3,
            start: 0, end: 2,
        }),
        repeat: 0,
        yoyo: true,
        frameRate: 15
    });
    anims.create({
        key: 'guardAttack',
        frames: anims.generateFrameNames('guard', {
            prefix: 'guard/shoot_', suffix: '.png',
            zeroPad: 3,
            start: 0, end: 2,
        }),
        repeat: 0,
        yoyo: true,
        frameRate: 10
    });
}
