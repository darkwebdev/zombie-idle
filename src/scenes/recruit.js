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
import { MainMenu } from './ui/menu';
import { createZombieAnims, addZombieEntity, respawnZombie, loadZombieAtlas, } from '../entities/Zombie';
import { addRecruitEntity, createRecruitAnims, loadRecruitAtlas, respawnRecruit } from '../entities/Recruit';
import { createBg, loadBg } from './common/nightCity';
import { Levels, Sprites } from '../const';
import { showPreloader } from './common/preloader';
import { createUI, loadUi } from './ui/ui';

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
        createUI(this, MainMenu(this));
        createZombieAnims(this.anims);
        createRecruitAnims(this.anims);


        // ECS
        this.world = window.world = createWorld();
        this.world.name = 'Zombieland';
        const zombie = addZombieEntity(this.world);
        respawnZombie(zombie);
        const soldier = addRecruitEntity(this.world);
        respawnRecruit(soldier);

        this.playerSystem = createPlayerSystem();
        this.movementSystem = createMovementSystem();
        this.battleSystem = createBattleSystem();
        this.skillSystem = createSkillSystem();
        this.healthBarSystem = createHealthBarSystem(this);
        this.damageDisplaySystem = createDamageDisplaySystem(this);
        this.spriteSystem = createSpriteSystem(this, Object.keys(Sprites).map(s => s.toLowerCase()));
        this.debugSystem = createDebugSystem(this);

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
