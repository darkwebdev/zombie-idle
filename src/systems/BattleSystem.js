import { addComponent, defineQuery, defineSystem, enterQuery, exitQuery, removeComponent } from 'bitecs';
import {
    AtMeleeRange,
    Attack,
    AttackedMelee,
    Damage,
    Dead,
    HitMelee,
    Input,
    Player,
    Position,
    Sprite,
    Stats
} from '../components';
import { isDead, withinMeleeRange } from './helpers';

export default () => {
    const playerQuery = defineQuery([Player,]);
    // const enemiesQuery = defineQuery([Position, Sprite, Not(Player),]);
    const battleQuery = defineQuery([Position, Sprite, ]);
    const atMeleeRangeQuery = defineQuery([AtMeleeRange, ]);
    const hitMeleeQuery = defineQuery([HitMelee, ]);
    const hitMeleeQueryEnter = enterQuery(hitMeleeQuery);
    const battleQueryEnter = enterQuery(battleQuery);
    const battleQueryExit = exitQuery(battleQuery);
    const lastHitTimes = new Map();

    return defineSystem((world, time) => {
        const [player] = playerQuery(world);

        battleQueryEnter(world).forEach(entity => {
            lastHitTimes.set(entity, -Infinity);
        });

        hitMeleeQueryEnter(world).forEach(entity => {
            console.log('Battle: Hit Melee!')
            const damage = doDamage(player, entity);
            showDamage(entity, damage);
            removeMeleeTarget(world, entity);
            removeComponent(world, HitMelee, entity);
        });

        switch (Input.speed[player]) {
            case 0:
                removeComponent(world, Attack, player);
                break;
            case 1:
                if (atMeleeRangeQuery(world).length === 0) {
                    removeComponent(world, Attack, player);
                }
                if (time > lastHitTimes.get(player) + 1000 / Stats.attackSpeed[player]) {
                    atMeleeRangeQuery(world).forEach(enemy => {
                        lastHitTimes.set(player, time);
                        addComponent(world, Attack, player);
                        addMeleeTarget(player, enemy);
                    });
                }
                break;
            default:
                // not implemented
        }

        battleQuery(world).forEach(entity => {
            if (isDead(entity)) {
                addComponent(world, Dead, entity);
                removeComponent(world, AtMeleeRange, entity);
            }
        });

        battleQueryExit(world).forEach(entity => {
            console.log('EXIT BATTLE', entity)
            lastHitTimes.delete(entity);
        });

        return world;
    });
}

const doDamage = (attacker, target) => {
    const random = Math.random();
    const damage = Stats.attack[attacker] * random * (Stats.hitChance[attacker]/100);
    Stats.hp[target] = Stats.hp[target] - damage;
    return damage;
}

const addMeleeTarget = (attacker, newTarget) => {
    AttackedMelee.attacker[newTarget] = attacker;
}

const removeMeleeTarget = (world, entity) => {
    removeComponent(world, AttackedMelee, entity);
}

const showDamage = (entity, damage) => {
    Damage.value[entity] = Math.round((damage + Number.EPSILON) * 100);
}
