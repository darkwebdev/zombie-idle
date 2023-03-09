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
    Position, Skills,
    Sprite,
    Stats
} from '../components';
import { coolDownFromAtkSpeed, isDead } from './helpers';
import { HP_PER_ATTACK_LEVEL, SkillProps } from '../const';

export default () => {
    const playerQuery = defineQuery([Player,]);
    // const enemiesQuery = defineQuery([Position, Sprite, Not(Player),]);
    const battleQuery = defineQuery([Position, Sprite, ]);
    const atMeleeRangeQuery = defineQuery([AtMeleeRange, ]);
    const hitMeleeQuery = defineQuery([HitMelee, ]);
    const hitMeleeQueryEnter = enterQuery(hitMeleeQuery);
    const battleQueryEnter = enterQuery(battleQuery);
    const battleQueryExit = exitQuery(battleQuery);
    const lastTimeSkillUsed = new Map();

    return defineSystem((world, time, delta) => {
        const [player] = playerQuery(world);

        const attackEnemyMelee = enemy => {
            lastTimeSkillUsed.set(player, time);
            addComponent(world, Attack, player);
            addComponent(world, AttackedMelee, enemy);
            AttackedMelee.attacker[enemy] = player;
        };

        battleQueryEnter(world).forEach(entity => {
            lastTimeSkillUsed.set(entity, -Infinity);
        });

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

        battleQueryExit(world).forEach(entity => {
            console.log('Battle: exit', entity)
            lastTimeSkillUsed.delete(entity);
        });

        return world;
    });
}

const doDamage = (attacker, target) => {
    const random = Math.random();
    const damage = Skills.attack[attacker][SkillProps.Level]
        * HP_PER_ATTACK_LEVEL
        * random
        * (Stats.hitChance[attacker]/100);
    Stats.hp[target] = Stats.hp[target] - damage;
    return damage;
}

const showDamage = (entity, damage) => {
    Damage.value[entity] = Math.round((damage + Number.EPSILON) * 100);
}
