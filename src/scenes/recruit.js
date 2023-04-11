import { Scene } from 'phaser';
import { createWorld } from 'bitecs';

import {
    createBattleSystem,
    createMovementSystem,
    createPlayerSystem,
    createSpriteSystem,
    createHealthBarSystem,
    createUISystem,
    createDamageDisplaySystem,
    createSkillSystem,
} from '../systems';
import { respawnZombie, loadZombieAtlas, createZombie, } from '../entities/Zombie';
import { createRecruit, loadRecruitAtlas, respawnRecruit } from '../entities/Recruit';
import { createBg, loadBg } from './common/nightCity';
import { Levels, Sprites } from '../const';
import { showPreloader } from './common/preloader';
import { loadUi } from './ui/ui';

export class RecruitLevel extends Scene {
    constructor() {
        super(Levels.Recruit);
    }

    preload() {
        showPreloader(this);

        loadBg(this);
        loadUi(this);
        loadZombieAtlas(this);
        loadRecruitAtlas(this);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create() {
        createBg(this);

        // ECS
        this.world = window.world = createWorld();
        this.world.name = 'Zombieland';
        const zombie = createZombie(this);
        respawnZombie(zombie);
        const recruit = createRecruit(this);
        respawnRecruit(recruit);

        this.playerSystem = createPlayerSystem();
        this.movementSystem = createMovementSystem();
        this.battleSystem = createBattleSystem();
        this.skillSystem = createSkillSystem();
        this.healthBarSystem = createHealthBarSystem(this);
        this.damageDisplaySystem = createDamageDisplaySystem(this);
        this.spriteSystem = createSpriteSystem(this, Object.keys(Sprites).map(s => s.toLowerCase()));
        this.uiSystem = createUISystem(this);

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
