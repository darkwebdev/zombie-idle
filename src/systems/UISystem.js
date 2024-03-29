import { addComponent, defineQuery, defineSystem, hasComponent, Not, removeComponent } from 'bitecs';
import {
    Attack,
    AttackedMelee,
    Damage,
    Dead, HitMelee,
    Input,
    Player,
    Position,
    Skills,
    Stats,
    Velocity,
    Walk
} from '../components';
import { SkillProps } from '../const';
import { addGuardEntity, respawnGuard } from '../entities/Guard';
import { createUI } from '../scenes/ui/ui';
import { MainMenu } from '../scenes/ui/menu';

const style = {
    font: '16px Courier',
    fill: '#00aa00',
};
const COL_Y = 490;
const colXs = [10, 160, 360, 550, 750];
let enemy = 1;

export default (scene) => {
    const [player] = defineQuery([Player,])(scene.world);
    const enemiesQuery = defineQuery([Stats, Not(Player),]);
    const attackedMeleeQuery = defineQuery([AttackedMelee,]);

    createUI({
        scene,
        menu: MainMenu(scene),
        player,
        InputDebug: Input.debug,
        InputAutoplay: Input.autoplay,
        InputSpeed: Input.speed,
    });

    // Debug settings:
    Input.debug[player] = 0;
    scene.debugDraw.toggle();
    toggleSceneWatcher();
    scene.debugDraw.showPointers = false;
    //showInput
    //showInactivePointers
    //showRotation
    //showLights

    const cols = [0,1,2,3].map(i => scene.add
        .text(colXs[i], COL_Y, '', style)
        .setOrigin(0, 0)
        .setScrollFactor(0));

    scene.input.keyboard.on('keydown-BACKTICK', () => {
        Input.debug[player] = 1 - Input.debug[player];
        scene.debugDraw.toggle();
        toggleSceneWatcher();
    });
    scene.input.keyboard.on('keydown-P', () => {
        scene.scene.pause();
        console.log('Paused.')
    });
    let state = 0;
    scene.input.keyboard.on('keydown-S', () => {
        switch (state) {
            case 0:
                console.log('Changing state to walking...')
                addComponent(world, Walk, enemy);
                state = 1;
                break;
            case 1:
                console.log('Changing state to attacking...')
                removeComponent(world, Walk, enemy);
                addComponent(world, Attack, enemy);
                state = 2;
                break;
            case 2:
                console.log('Changing state to hit...')
                removeComponent(world, Attack, enemy);
                addComponent(world, HitMelee, enemy);
                state = 3;
                break;
            case 3:
                console.log('Changing state to dying...')
                removeComponent(world, HitMelee, enemy);
                addComponent(world, Dead, enemy);
                state = 4;
                break;
            default:
                console.log('Changing state to idle...')
                // removeComponent(world, Dead, enemy);
                state = 0;
                break;
        }
    });
    scene.input.keyboard.on('keydown-SPACE', () => {
        Input.autoplay[player] = 1 - Input.autoplay[player];
    });
    scene.input.keyboard.on('keydown-H', () => {
        Stats.hitChance[player] += 10;
    });
    scene.input.keyboard.on('keydown-C', () => {
        Stats.criticalChance[player] += 10;
    });
    scene.input.keyboard.on('keydown-D', () => {
        if (scene.cursors.shift.isDown) {
            Damage.value[enemy] = Math.random() * 100;
        } else {
            Stats.criticalDamage[player] += 10;
        }
    });
    const respawnEnemy = () => {
        enemy = addGuardEntity(scene.world);
        respawnGuard(enemy);
        Position.x[enemy] = Position.x[player] + scene.scale.width - 100;
        console.log('Respawn enemy at x:', Position.x[enemy]);
    };
    scene.input.keyboard.on('keydown-R', () => {
        if (scene.cursors.shift.isDown) {
            for (let i = 0; i < 10; i++) respawnEnemy();
        } else {
            respawnEnemy();
        }
    });

    return defineSystem((world) => {
        if (scene.cursors.right.isDown) {
            Input.autoplay[player] = 0;
            Input.speed[player] = 1;
        } else if (!Input.autoplay[player]) {
            Input.speed[player] = 0;
        }

        if (Input.debug[player]) {
            const enemies = enemiesQuery(world);
            const attackedMeleeEntities = attackedMeleeQuery(world);
            const state = entity =>
                hasComponent(world, Walk, entity) && 'Walk' ||
                hasComponent(world, Attack, entity) && 'Attack' ||
                hasComponent(world, Dead, entity) && 'Dead' ||
                hasComponent(world, HitMelee, entity) && 'Hit' ||
                'Idle'
            ;

            cols[0].setText([
                `Player [${state(player)}]`,
                `x: ${Position.x[player]}, vx: ${Velocity.x[player]}`,
                'hp: ' + Stats.hp[player] + '/' + Stats.maxHp[player],
                `atk spd: ${Stats.attackSpeed[player]}/sec`,
                `hit chance: ${Stats.hitChance[player]}%`,
                `crit chance/dmg: ${Stats.criticalChance[player]}%/${Stats.criticalDamage[player]}`,
            ]);
            // console.log(Skills)
            cols[1].setText([
                `Skills`,
                Object
                    .keys(Skills)
                    .map(name => {
                        const level = Skills[name][player][SkillProps.Level];
                        const cooldown = (Skills[name][player][SkillProps.Cooldown] / 1000).toFixed(1);
                        return `${name}: ${level} [${cooldown}]`;
                    })
                    .join('\n'),
            ]);
            const meleeTargets = attackedMeleeEntities.filter(e => AttackedMelee.attacker[e] === player);
            cols[2].setText([
                `Enemy [${state(enemy)}]`,
                `entities (${enemies.length}):\n[${enemies}]`,
                `melee targets (${meleeTargets.length}):\n[${meleeTargets}]`,
            ]);
            cols[3].setText([
                '',
            ]);
        } else {
            cols.forEach(c => c.setText(''));
        }

        return world;
    });
}

function toggleSceneWatcher() {
    document.querySelectorAll('body > pre').forEach(el => {
        el.style.display = el.style.display === 'none' ? '' : 'none';
    });
}
