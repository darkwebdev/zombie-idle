import { Scene } from 'phaser';
import { createWorld } from 'bitecs';

import {
    createBattleSystem,
    createMovementSystem,
    createPlayerSystem,
    createSpriteSystem,
    createHealthBarSystem,
    createDebugSystem,
    createDamageDisplaySystem,
    createSkillSystem,
} from '../systems';
import { MainMenu } from './common/menu';
import { createZombieAnims, addZombieEntity, respawnZombie, } from '../entities/Zombie';
import { addGuardEntity, createGuardAnims, respawnGuard } from '../entities/Guard';
import { createBg, loadBg } from './common/nightCity';
import { Sprites } from '../const';
import { showPreloader } from './common/preloader';
import { loadUi } from './common/ui';

export class GuardLevel extends Scene {
    constructor() {
        super('guardLevel');
    }

    preload() {
        showPreloader(this);

        loadBg(this);
        loadUi(this);
        this.load.atlas('zombie', 'assets/zombie.png', 'assets/zombie.json');
        this.load.atlas('guard', 'assets/guard.png', 'assets/guard.json');

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create() {
        createBg(this);
        createZombieAnims(this.anims);
        createGuardAnims(this.anims);
        MainMenu(this);


        // ECS
        this.world = window.world = createWorld();
        this.world.name = 'Zombieland';
        const zombie = addZombieEntity(this.world);
        respawnZombie(zombie);
        const soldier = addGuardEntity(this.world);
        respawnGuard(soldier);

        this.playerSystem = createPlayerSystem();
        this.movementSystem = createMovementSystem();
        this.battleSystem = createBattleSystem();
        this.skillSystem = createSkillSystem();
        this.healthBarSystem = createHealthBarSystem(this);
        this.damageDisplaySystem = createDamageDisplaySystem(this);
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
        this.battleSystem(this.world, time, delta);
        this.skillSystem(this.world, time, delta);
        this.healthBarSystem(this.world);
        this.damageDisplaySystem(this.world);
        this.spriteSystem(this.world);
        this.debugSystem(this.world);
    }
}
