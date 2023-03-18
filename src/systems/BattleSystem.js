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
import {
    ATTACK_DEVIATION_PERCENT,
    CROWD_ATTACK_COOLDOWN_MULTIPLIER,
    HP_PER_ATTACK_LEVEL,
    SkillNames,
    SkillProps
} from '../const';

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
            removeComponent(world, AttackedMelee, entity);
            // removeComponent(world, HitMelee, entity);
            const damage = damageInflicted(player, entity);
            if (damage.isMiss) {
                console.log('MISS')
                removeComponent(world, HitMelee, entity);
            }
            console.log(`Battle: Hit Melee! Enemy: ${entity}(${Stats.hp[entity]}) Damage: ${damage.value}`)
            showDamage(entity, damage);

            if (damage.value > 0) {
                Stats.hp[entity] = Stats.hp[entity] - damage.value;
            }
        });

        switch (Input.speed[player]) {
            case 0:
                removeComponent(world, Attack, player);
                break;
            case 1:
                // Melee
                const enemiesAtMeleeRange = atMeleeRangeQuery(world);
                if (enemiesAtMeleeRange.length === 0) {
                    removeComponent(world, Attack, player);
                } else {
                    const crowdAttacked = trySkill({
                        skill: Skills[SkillNames.CrowdAttack][player],
                        skillFn: () => enemiesAtMeleeRange.forEach(attackEnemyMelee),
                        cooldown: coolDownFromAtkSpeed(Stats.attackSpeed[player]) * CROWD_ATTACK_COOLDOWN_MULTIPLIER,
                    });
                    if (!crowdAttacked) {
                        trySkill({
                            skill: Skills[SkillNames.Attack][player],
                            skillFn: () => attackEnemyMelee(enemiesAtMeleeRange[0]),
                            cooldown: coolDownFromAtkSpeed(Stats.attackSpeed[player]),
                        });
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
                console.log('Dead:', entity, Stats.hp[entity])
                addComponent(world, Dead, entity);
                removeComponent(world, HitMelee, entity);
                removeComponent(world, AtMeleeRange, entity);
            }
        });

        return world;
    });
}

const damageInflicted = (attacker, target) => {
    const missed = Stats.hitChance[attacker] < 100 && Math.random() * 100 > Stats.hitChance[attacker];

    if (missed) {
        return {
            isMiss: true
        };
    }

    const avgAttack = Skills.attack[attacker][SkillProps.Level] * HP_PER_ATTACK_LEVEL;
    const minAttack = avgAttack * (1 - ATTACK_DEVIATION_PERCENT/100/2);
    const randomDeviation = Math.random() * avgAttack * ATTACK_DEVIATION_PERCENT/100;
    const critMultiplier = criticalMultiplier(attacker, target);
    const damage = Math.ceil((minAttack + randomDeviation) * critMultiplier);

    return {
        value: damage,
        isCritical: critMultiplier > 1,
    };
}

const showDamage = (entity, damage) => {
    Damage.value[entity] = damage.value;
    Damage.isCritical[entity] = damage.isCritical ? 1 : 0;
    Damage.isMiss[entity] = damage.isMiss ? 1 : 0;
}

const criticalMultiplier = (attacker, target) => {
    const isCritical = Stats.criticalChance[attacker] === 100 || Math.random() * 100 <= Stats.criticalChance[attacker];

    return isCritical ? Stats.criticalDamage[attacker] / 100 : 1;
}

const trySkill = ({ skill, skillFn, cooldown }) => {
    if (skill[SkillProps.Level] < 1 || skill[SkillProps.Cooldown] > 0) {
        return false;
    }
    skillFn();
    skill[SkillProps.Cooldown] = cooldown;
    return true;
}
