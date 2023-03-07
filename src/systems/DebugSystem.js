import { defineQuery, defineSystem, hasComponent } from 'bitecs';
import { Input, Player, Position, Velocity, Stats, Damage, AttackedMelee, Walk, Attack, Dead } from '../components';
import { addCowboyEntity, respawnCowboy } from '../entities/Cowboy';

const style = {
    font: '16px Courier',
    fill: '#00aa00',
};
const COL1_X = 10;
const COL_WIDTH = 200;
const COL_Y = 500;
let enemy = 2;

export default (scene) => {
    let debug = true;
    const playerQuery = defineQuery([Player,]);
    const attackedMeleeQuery = defineQuery([AttackedMelee,]);
    // const debugQuery = defineQuery([Input,]);
    const col1 = scene.add
        .text(COL1_X, COL_Y, '', style)
        .setOrigin(0, 0)
        .setScrollFactor(0);
    const col2 = scene.add
        .text(COL1_X+COL_WIDTH, COL_Y, '', style)
        .setOrigin(0, 0)
        .setScrollFactor(0);

    scene.input.keyboard.on('keydown-BACKTICK', () => {
        debug = !debug;
        scene.debugDraw.toggle();
    });
    scene.input.keyboard.on('keydown-D', () => {
        console.log('Damaging...')
        Damage.value[enemy] = 300;
    });
    scene.input.keyboard.on('keydown-R', () => {
        const [player] = playerQuery(scene.world);
        enemy = addCowboyEntity(scene.world);
        respawnCowboy(enemy);
        Position.x[enemy] = Position.x[player] + scene.scale.width - 100;
        console.log('Respawn enemy at x:', Position.x[enemy]);
    });

    return defineSystem((world) => {
        if (debug) {
            const [player] = playerQuery(world);
            const attackedMeleeEntities = attackedMeleeQuery(world);

            col1.setText([
                'x: ' + Position.x[player],
                'vx: ' + Velocity.x[player],
                'hp: ' + Stats.hp[player] + '/' + Stats.maxHp[player],
                'atk: ' + Stats.attack[player],
                'atk spd: ' + Stats.attackSpeed[player],
                'hit chance: ' + Stats.hitChance[player],
            ]);
            const state = entity =>
                hasComponent(world, Walk, entity) && 'Walk' ||
                hasComponent(world, Attack, entity) && 'Attack' ||
                hasComponent(world, Dead, entity) && 'Dead' ||
                'Idle'
            ;
            col2.setText([
                'D - damage target',
                'R - respawn target',
                `player state: ${state(player)}`,
                `enemy state: ${state(enemy)}`,
                `melee targets: [${attackedMeleeEntities.filter(e => AttackedMelee.attacker[e] === player)}]`,
            ]);
        } else {
            col1.setText('');
        }

        return world;
    });
}
