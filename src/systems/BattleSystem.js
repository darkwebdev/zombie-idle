import { defineQuery, defineSystem, enterQuery, exitQuery } from 'bitecs';
import { Input, Player, Position, Sprite, Animation, Stats } from '../components';
import { AnimationStates } from '../const';
import { isDead, withinMeleeRange } from './helpers';

export default () => {
    const playerQuery = defineQuery([Player,]);
    const battleQuery = defineQuery([Position, Sprite, Animation, ]);
    const battleQueryEnter = enterQuery(battleQuery);
    const battleQueryExit = exitQuery(battleQuery);
    const lastHitTimes = new Map();

    return defineSystem((world, time) => {
        const [player] = playerQuery(world);

        battleQueryEnter(world).forEach(entity => {
            lastHitTimes.set(entity, -Infinity);
        });

        battleQuery(world).forEach(entity => {
            if (Input.speed[player] === 1) {
                // console.log(time, lastHitTimes[player], 1000/Stats.attackSpeed[player])
                if (time > lastHitTimes.get(player) + 1000/Stats.attackSpeed[player]) {
                    if (player !== entity && withinMeleeRange(entity, player)) {
                        attack(player, entity);
                        lastHitTimes.set(player, time);
                        Animation.state[player] = AnimationStates.Attack;
                    }
                }
                if (isDead(entity)) {
                    Animation.state[entity] = AnimationStates.Dead;
                }
            }
        });

        battleQueryExit(world).forEach(entity => {
            lastHitTimes.delete(entity);
        });

        return world;
    });
}

const attack = (attacker, victim) => {
    const random = Math.random();
    const damage = Stats.attack[attacker] * random * (Stats.hitChance[attacker]/100);
    Stats.hp[victim] = Stats.hp[victim] - damage;
    console.log('DMG', damage)
}

