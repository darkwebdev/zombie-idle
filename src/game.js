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
} from './systems';
import { createZombieAnims, addZombieEntity, respawnZombie, } from './entities/Zombie';
import { createCowboyAnims, addCowboyEntity, respawnCowboy } from './entities/Cowboy';
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
        this.world = window.world = createWorld();
        this.world.name = 'Zombieland';
        const zombie = addZombieEntity(this.world);
        respawnZombie(zombie);
        const cowboy = addCowboyEntity(this.world);
        respawnCowboy(cowboy);

        this.playerSystem = createPlayerSystem();
        this.movementSystem = createMovementSystem();
        this.battleSystem = createBattleSystem();
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
        this.healthBarSystem(this.world);
        this.damageDisplaySystem(this.world);
        this.spriteSystem(this.world);
        this.debugSystem(this.world);
    }
}
