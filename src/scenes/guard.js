import { Scene } from 'phaser';
import { createWorld } from 'bitecs';

import {
    createBattleSystem,
    createDamageDisplaySystem,
    createDebugSystem,
    createHealthBarSystem,
    createMovementSystem,
    createPlayerSystem,
    createSkillSystem,
    createSpriteSystem,
} from '../systems';
import { MainMenu } from './ui/menu';
import { addZombieEntity, createZombieAnims, loadZombieAtlas, respawnZombie, } from '../entities/Zombie';
import { addGuardEntity, createGuardAnims, loadGuardAtlas, respawnGuard } from '../entities/Guard';
import { createBg, loadBg } from './common/nightCity';
import { Levels, Sprites } from '../const';
import { showPreloader } from './common/preloader';
import { createUI, loadUi } from './ui/ui';

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
        createUI(this, MainMenu(this));
        createZombieAnims(this.anims);
        createGuardAnims(this.anims);


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
