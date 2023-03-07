import { defineQuery, defineSystem, hasComponent, Not } from 'bitecs';
import { Attack, AttackedMelee, Damage, Dead, Input, Player, Position, Stats, Velocity, Walk } from '../components';
import { addCowboyEntity, respawnCowboy } from '../entities/Cowboy';

const style = {
    font: '16px Courier',
    fill: '#00aa00',
};
const COL_X = 10;
const COL_Y = 490;
const COL_WIDTH = 250;
let enemy = 1;

export default (scene) => {
    const [player] = defineQuery([Player,])(scene.world);
    const enemiesQuery = defineQuery([Stats, Not(Player),]);
    const attackedMeleeQuery = defineQuery([AttackedMelee,]);

    Input.debug[player] = 1;
    const cols = [0,1,2].map(i => scene.add
        .text(COL_X+COL_WIDTH*i, COL_Y, '', style)
        .setOrigin(0, 0)
        .setScrollFactor(0));

    scene.input.keyboard.on('keydown-BACKTICK', () => {
        Input.debug[player] = 1 - Input.debug[player];
        scene.debugDraw.toggle();
    });
    scene.input.keyboard.on('keydown-SPACE', () => {
        Input.autoplay[player] = 1 - Input.autoplay[player];
    });
    scene.input.keyboard.on('keydown-D', () => {
        Damage.value[enemy] = 300;
    });
    scene.input.keyboard.on('keydown-R', () => {
        enemy = addCowboyEntity(scene.world);
        respawnCowboy(enemy);
        Position.x[enemy] = Position.x[player] + scene.scale.width - 100;
        console.log('Respawn enemy at x:', Position.x[enemy]);
    });

    return defineSystem((world) => {
        if (Input.debug[player]) {
            if (scene.cursors.right.isDown) {
                Input.autoplay[player] = 0;
                Input.speed[player] = 1;
            } else if (!Input.autoplay[player]) {
                Input.speed[player] = 0;
            }

            const enemies = enemiesQuery(world);
            const attackedMeleeEntities = attackedMeleeQuery(world);
            const state = entity =>
                hasComponent(world, Walk, entity) && 'Walk' ||
                hasComponent(world, Attack, entity) && 'Attack' ||
                hasComponent(world, Dead, entity) && 'Dead' ||
                'Idle'
            ;

            cols[0].setText([
                `Player [${state(player)}]`,
                `x: ${Position.x[player]}, vx: ${Velocity.x[player]}`,
                'hp: ' + Stats.hp[player] + '/' + Stats.maxHp[player],
                `atk power: ${Stats.attack[player]}`,
                `atk spd: ${Stats.attackSpeed[player]}/sec`,
                `hit chance: ${Stats.hitChance[player]}%`,
            ]);
            const meleeTargets = attackedMeleeEntities.filter(e => AttackedMelee.attacker[e] === player);
            cols[1].setText([
                `Enemy [${state(enemy)}]`,
                `all enemies (${enemies.length}): [${enemies}]`,
                `melee targets (${meleeTargets.length}): [${meleeTargets}]`,
            ]);
            cols[2].setText([
                `Hotkeys`,
                'Space - autoplay on/off',
                'Arrow right - play step',
                'D (or click) - show damage',
                'R - respawn target',
            ]);
        } else {
            cols.forEach(c => c.setText(''));
        }

        return world;
    });
}
