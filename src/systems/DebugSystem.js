import { defineQuery, defineSystem } from 'bitecs';
import { Input, Player, Position, Velocity, Stats } from '../components';

const style = {
    font: '16px Courier',
    fill: '#00aa00',
};

export default (scene) => {
    let debug = true;
    const playerQuery = defineQuery([Player,]);
    // const debugQuery = defineQuery([Input,]);
    const text = scene.add
        .text(10, 10, '', style)
        .setOrigin(0, 0)
        .setScrollFactor(0);

    scene.input.keyboard.on('keydown-BACKTICK', () => {
        debug = !debug;
        scene.debugDraw.toggle();
    })

    return defineSystem((world) => {
        if (debug) {
            const [player] = playerQuery(world);
            // debugQuery(world).forEach(entity => {})

            text.setText([
                'x: ' + Position.x[player],
                'vx: ' + Velocity.x[player],
                'hp: ' + Stats.hp[player] + '/' + Stats.maxHp[player],
                'atk: ' + Stats.attack[player],
                'atk spd: ' + Stats.attackSpeed[player],
                'hit chance: ' + Stats.hitChance[player],
                'game spd: ' + Input.speed[player],
            ]);
        } else {
            text.setText('');
        }

        return world;
    });
}
