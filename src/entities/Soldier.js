import { addComponent, addEntity } from 'bitecs';
import { Damage, Position, Size, Sprite, Stats, Velocity } from '../components';
import { Sprites } from '../const';

export const DEAD_ANIM_ADJUST_Y = 40;
export const HIT_ANIM_ADJUST_X = -40;

const initialSoldierState = {
    width: 100,
    height: 300,
    x: 600,
    y: 450,
    velocity: 0,
    // stats
    hp: 25,
    maxHp: 25,
    attackSpeed: 1,
    // skills
    attack: 1,
};

export const respawnSoldier = entity => {
    Position.x[entity] = initialSoldierState.x;
    Position.y[entity] = initialSoldierState.y;
    Size.width[entity] = initialSoldierState.width;
    Size.height[entity] = initialSoldierState.height;
    Velocity.x[entity] = initialSoldierState.velocity;

    Stats.hp[entity] = initialSoldierState.hp;
    Stats.maxHp[entity] = initialSoldierState.maxHp;
    Stats.attackSpeed[entity] = initialSoldierState.attackSpeed;

    Sprite.texture[entity] = Sprites.Soldier;
}

export const addSoldierEntity = world => {
    const entity = addEntity(world);

    addComponent(world, Position, entity);
    addComponent(world, Velocity, entity);
    addComponent(world, Size, entity);
    addComponent(world, Stats, entity);
    addComponent(world, Damage, entity);
    addComponent(world, Sprite, entity);

    return entity;
};

export const createSoldierAnims = (anims) => {
    anims.create({
        key: 'soldierIdle',
        frames: anims.generateFrameNames('soldier', {
            prefix: 'soldier/idle_', suffix: '.png',
            zeroPad: 3,
            start: 0, end: 5,
        }),
        repeat: -1,
        frameRate: 6
    });
    anims.create({
        key: 'soldierWalk',
        frames: anims.generateFrameNames('soldier', {
            prefix: 'soldier/walk_', suffix: '.png',
            zeroPad: 3,
            start: 0, end: 5,
        }),
        repeat: -1,
        frameRate: 6
    });
    anims.create({
        key: 'soldierHit',
        frames: anims.generateFrameNames('soldier', {
            prefix: 'soldier/hit_', suffix: '.png',
            zeroPad: 3,
            start: 0, end: 3,
        }),
        repeat: 0,
        frameRate: 6
    });
    anims.create({
        key: 'soldierDead',
        frames: anims.generateFrameNames('soldier', {
            prefix: 'soldier/dead_', suffix: '.png',
            zeroPad: 3,
            start: 0, end: 9,
        }),
        repeat: 0,
        frameRate: 6
    });
}
