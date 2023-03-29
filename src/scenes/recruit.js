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
import { addRecruitEntity, createRecruitAnims, respawnRecruit } from '../entities/Recruit';
import { createBg, loadBg } from './common/nightCity';
import { Sprites } from '../const';
import { showPreloader } from './common/preloader';
import { loadUi } from './common/ui';

export class RecruitLevel extends Scene {
    constructor() {
        super('recruitLevel');
    }

    preload() {
        showPreloader(this);

        loadBg(this);
        loadUi(this);
        this.load.atlas('zombie', 'assets/zombie.png', 'assets/zombie.json');
        this.load.atlas('recruit', 'assets/recruit.png', 'assets/recruit.json');

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    create() {
        createBg(this);
        createZombieAnims(this.anims);
        createRecruitAnims(this.anims);
        MainMenu(this);


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
