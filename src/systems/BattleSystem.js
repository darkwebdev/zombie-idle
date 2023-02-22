import { defineQuery, defineSystem } from 'bitecs';
import { Input, Player, Position, Sprite, Animation, Stats } from '../components';
import { AnimationStates } from '../const';
import { checkOverlap, isDead } from './helpers';

export default () => {
    const playerQuery = defineQuery([Player,]);
    const battleQuery = defineQuery([Position, Sprite, Animation, ]);

    return defineSystem((world) => {
        const [player] = playerQuery(world);

        battleQuery(world).forEach(entity => {
            if (Input.speed[player] === 1) {
                if (player !== entity && checkOverlap(player, entity)) {
                    attack(player, entity);
                    Animation.state[player] = AnimationStates.Attack;
                }
                if (isDead(entity)) {
                    Animation.state[entity] = AnimationStates.Dead;
                }
            }
        });

        return world;
    });
}

const attack = (attacker, victim) => {
    Stats.hp[victim] = Stats.hp[victim] - Stats.attack[attacker];
}

