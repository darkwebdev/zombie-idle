import { Scene } from 'phaser';
import { addComponent, addEntity, createWorld } from 'bitecs';

import { Input, Player, Size, Position, Sprite, Animation, Stats, Velocity } from './components';
import {
    createBattleSystem,
    createDebugSystem, createHealthBarSystem,
    createMovementSystem,
    createPlayerSystem,
    createSpriteSystem
} from './systems';
import { createZombieAnims, initialZombieState, } from './zombie';
import { createCowboyAnims, initialCowboyState } from './cowboy';
import { createBg } from './bg';
import { Sprites } from './const';

export class IdleZombie extends Scene {
    constructor() {
        super();
    }

    preload() {
        this.load.image('sky', 'assets/bg/1/Night/1.png');
        for (let line = 0; line < 4; line++) {
            for (let screen = 0; screen < 8; screen++) {
                this.load.image(`building${line}${screen}`, `assets/bg/${screen + 1}/Night/${line + 2}.png`);
            }
        }
        this.load.atlas('zombie', 'assets/zombie.png', 'assets/zombie.json');
        this.load.atlas('cowboy', 'assets/cowboy.png', 'assets/cowboy.json');

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create() {
        createBg(this);
        createZombieAnims(this.anims);
        createCowboyAnims(this.anims);

        // ECS
        this.world = createWorld();
        this.world.name = 'Zombieland';

        const zombie = addEntity(this.world);
        addComponent(this.world, Position, zombie);
        addComponent(this.world, Velocity, zombie);
        addComponent(this.world, Stats, zombie);
        addComponent(this.world, Sprite, zombie);
        addComponent(this.world, Animation, zombie);
        addComponent(this.world, Player, zombie);
        addComponent(this.world, Input, zombie);
        Position.x[zombie] = initialZombieState.x;
        Position.y[zombie] = initialZombieState.y;
        Size.width[zombie] = initialZombieState.width;
        Size.height[zombie] = initialZombieState.height;
        Velocity.x[zombie] = initialZombieState.velocity;
        Stats.hp[zombie] = initialZombieState.hp;
        Stats.maxHp[zombie] = initialZombieState.maxHp;
        Stats.attack[zombie] = initialZombieState.attack;
        Stats.attackSpeed[zombie] = initialZombieState.attackSpeed;
        Stats.hitChance[zombie] = initialZombieState.hitChance;
        Sprite.texture[zombie] = Sprites.Zombie;

        const cowboy = addEntity(this.world);
        addComponent(this.world, Position, cowboy);
        addComponent(this.world, Stats, cowboy);
        addComponent(this.world, Sprite, cowboy);
        addComponent(this.world, Animation, cowboy);
        Position.x[cowboy] = initialCowboyState.x;
        Position.y[cowboy] = initialCowboyState.y;
        Size.width[cowboy] = initialCowboyState.width;
        Size.height[cowboy] = initialCowboyState.height;
        Stats.hp[cowboy] = initialCowboyState.hp;
        Stats.maxHp[cowboy] = initialCowboyState.maxHp;
        Stats.attack[cowboy] = initialCowboyState.attack;
        Stats.attackSpeed[cowboy] = initialCowboyState.attackSpeed;
        Sprite.texture[cowboy] = Sprites.Cowboy;

        this.playerSystem = createPlayerSystem(this.cursors);
        this.movementSystem = createMovementSystem();
        this.battleSystem = createBattleSystem();
        this.healthBarSystem = createHealthBarSystem(this);
        this.spriteSystem = createSpriteSystem(this, Object.keys(Sprites).map(s => s.toLowerCase()));
        this.debugSystem = createDebugSystem(this);

        // Collisions
        // const enemies = this.physics.add.group();
        // enemies.create(0, 0, 'cowboy').setScale(0.5).refreshBody();
        // this.physics.add.collider(this.zombie, this.cowboy, () => {
        //     console.log('COLLIDE!');
        // });
    }

    update(time, delta) {
        // super.update(time, delta);

        this.playerSystem(this.world);
        this.movementSystem(this.world);
        this.battleSystem(this.world, time);
        this.healthBarSystem(this.world);
        this.spriteSystem(this.world);
        this.debugSystem(this.world);
    }
}
