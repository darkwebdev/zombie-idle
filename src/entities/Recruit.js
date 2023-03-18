import { addComponent, addEntity } from 'bitecs';
import { Damage, Position, Size, Sprite, Stats, Velocity } from '../components';
import { Sprites } from '../const';

export const DEAD_ANIM_ADJUST_Y = 40;
export const HIT_ANIM_ADJUST_X = -40;

const initialRecruitState = {
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

export const respawnRecruit = entity => {
    Position.x[entity] = initialRecruitState.x;
    Position.y[entity] = initialRecruitState.y;
    Size.width[entity] = initialRecruitState.width;
    Size.height[entity] = initialRecruitState.height;
    Velocity.x[entity] = initialRecruitState.velocity;

    Stats.hp[entity] = initialRecruitState.hp;
    Stats.maxHp[entity] = initialRecruitState.maxHp;
    Stats.attackSpeed[entity] = initialRecruitState.attackSpeed;

    Sprite.texture[entity] = Sprites.Recruit;
}

export const addRecruitEntity = world => {
    const entity = addEntity(world);

    addComponent(world, Position, entity);
    addComponent(world, Velocity, entity);
    addComponent(world, Size, entity);
    addComponent(world, Stats, entity);
    addComponent(world, Damage, entity);
    addComponent(world, Sprite, entity);

    return entity;
};

export const createRecruitAnims = (anims) => {
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
