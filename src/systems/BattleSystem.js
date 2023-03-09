import { addComponent, defineQuery, defineSystem, enterQuery, removeComponent } from 'bitecs';
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
    Skills,
    Sprite,
    Stats
} from '../components';
import { coolDownFromAtkSpeed, isDead } from './helpers';
import { ATTACK_DEVIATION_PERCENT, HP_PER_ATTACK_LEVEL, SkillProps } from '../const';

export default () => {
    const playerQuery = defineQuery([Player,]);
    // const enemiesQuery = defineQuery([Position, Sprite, Not(Player),]);
    const battleQuery = defineQuery([Position, Sprite, ]);
    const atMeleeRangeQuery = defineQuery([AtMeleeRange, ]);
    const hitMeleeQuery = defineQuery([HitMelee, ]);
    const hitMeleeQueryEnter = enterQuery(hitMeleeQuery);
    // const battleQueryEnter = enterQuery(battleQuery);
    // const battleQueryExit = exitQuery(battleQuery);
    const lastTimeSkillUsed = new Map();

    return defineSystem((world, time, delta) => {
        const [player] = playerQuery(world);

        const attackEnemyMelee = enemy => {
            lastTimeSkillUsed.set(player, time);
            addComponent(world, Attack, player);
            addComponent(world, AttackedMelee, enemy);
            AttackedMelee.attacker[enemy] = player;
        };

        hitMeleeQueryEnter(world).forEach(entity => {
            console.log('Battle: Hit Melee!')
            removeComponent(world, AttackedMelee, entity);
            removeComponent(world, HitMelee, entity);
            const damage = doDamage(player, entity);
            showDamage(entity, damage);
        });

        switch (Input.speed[player]) {
            case 0:
                removeComponent(world, Attack, player);
                break;
            case 1:
                // Meelee
                const enemiesAtMeleeRange = atMeleeRangeQuery(world);
                if (enemiesAtMeleeRange.length === 0) {
                    removeComponent(world, Attack, player);
                } else {
                    const [crowdAttackLevel, crowdAttackCooldown] = Skills.crowdAttack[player];
                    if (crowdAttackLevel > 0) {
                        if (crowdAttackCooldown > 0) {
                            Skills.crowdAttack[player][SkillProps.Cooldown] -= delta;
                            console.log('cooldown', crowdAttackCooldown, delta)
                        } else {
                            enemiesAtMeleeRange.forEach(attackEnemyMelee);
                        }
                    } else {
                        const [_, attackCooldown] = Skills.attack[player];
                        if (attackCooldown > 0) {
                            Skills.attack[player][SkillProps.Cooldown] -= delta;
                        } else {
                            console.log('attackEnemyMelee', enemiesAtMeleeRange[0])
                            attackEnemyMelee(enemiesAtMeleeRange[0]);
                            Skills.attack[player][SkillProps.Cooldown] = coolDownFromAtkSpeed(Stats.attackSpeed[player]);
                        }
                    }
                }

                // Ranged
                // not implemented yet
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

        return world;
    });
}

const doDamage = (attacker, target) => {
    const hitResult = Math.random() * Stats.hitChance[attacker]/100;
    const missed = hitResult < Stats.hitChance[attacker]/200;

    if (missed) {
        return 0;
    }

    const avgAttack = Skills.attack[attacker][SkillProps.Level] * HP_PER_ATTACK_LEVEL;
    const minAttack = avgAttack * (1 - ATTACK_DEVIATION_PERCENT/100/2);
    const randomDeviation = Math.random() * avgAttack * ATTACK_DEVIATION_PERCENT/100;
    const damage = minAttack + randomDeviation;

    Stats.hp[target] = Stats.hp[target] - damage;

    return damage;
}

const showDamage = (entity, damage) => {
    Damage.value[entity] = Math.round((damage + Number.EPSILON) * 100);
}
