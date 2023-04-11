import { Scene } from 'phaser';
import { createWorld } from 'bitecs';

import {
    createBattleSystem,
    createDamageDisplaySystem,
    createUISystem,
    createHealthBarSystem,
    createMovementSystem,
    createPlayerSystem,
    createSkillSystem,
    createSpriteSystem,
} from '../systems';
import { createZombie, loadZombieAtlas, respawnZombie, } from '../entities/Zombie';
import { createGuard, loadGuardAtlas, respawnGuard } from '../entities/Guard';
import { createBg, loadBg } from './common/nightCity';
import { Levels, Sprites } from '../const';
import { showPreloader } from './common/preloader';
import { loadUi } from './ui/ui';

export class GuardLevel extends Scene {
    constructor() {
        super(Levels.Guard);
    }

    preload() {
        showPreloader(this);

        loadBg(this);
        loadUi(this);
        loadZombieAtlas(this);
        loadGuardAtlas(this);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create() {
        createBg(this);

        // ECS
        this.world = window.world = createWorld();
        this.world.name = 'Zombieland';
        const zombie = createZombie(this);
        respawnZombie(zombie);
        const guard = createGuard(this);
        respawnGuard(guard);

        this.playerSystem = createPlayerSystem();
        this.movementSystem = createMovementSystem();
        this.battleSystem = createBattleSystem();
        this.skillSystem = createSkillSystem();
        this.healthBarSystem = createHealthBarSystem(this);
        this.damageDisplaySystem = createDamageDisplaySystem(this);
        this.spriteSystem = createSpriteSystem(this, Object.keys(Sprites).map(s => s.toLowerCase()));
        this.uiSystem = createUISystem(this);

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
        this.battleSystem(this.world, time, delta);
        this.skillSystem(this.world, time, delta);
        this.healthBarSystem(this.world);
        this.damageDisplaySystem(this.world);
        this.spriteSystem(this.world);
        this.uiSystem(this.world);
    }
}
