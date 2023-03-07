import { addComponent, addEntity } from 'bitecs';
import { AttackedMelee, Damage, Position, Size, Sprite, Stats } from '../components';
import { Sprites } from '../const';

const initialCowboyState = {
    width: 100,
    height: 300,
    x: 600,
    y: 450,
    hp: 25,
    maxHp: 25,
    attack: 1,
    attackSpeed: 1
};

export const respawnCowboy = entity => {
    Position.x[entity] = initialCowboyState.x;
    Position.y[entity] = initialCowboyState.y;
    Size.width[entity] = initialCowboyState.width;
    Size.height[entity] = initialCowboyState.height;
    Stats.hp[entity] = initialCowboyState.hp;
    Stats.maxHp[entity] = initialCowboyState.maxHp;
    Stats.attack[entity] = initialCowboyState.attack;
    Stats.attackSpeed[entity] = initialCowboyState.attackSpeed;
    Sprite.texture[entity] = Sprites.Cowboy;
}

export const addCowboyEntity = world => {
    const cowboy = addEntity(world);

    addComponent(world, Position, cowboy);
    addComponent(world, Size, cowboy);
    addComponent(world, Stats, cowboy);
    addComponent(world, Damage, cowboy);
    addComponent(world, AttackedMelee, cowboy);
    addComponent(world, Sprite, cowboy);

    return cowboy;
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
