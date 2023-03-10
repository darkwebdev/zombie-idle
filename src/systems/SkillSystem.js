import { defineQuery, defineSystem } from 'bitecs';
import { Input, Player, Skills } from '../components';
import { SkillProps } from '../const';

export default () => {
    const playerQuery = defineQuery([Player,]);
    const skillQuery = defineQuery([Skills,]);

    return defineSystem((world, time, delta) => {
        const [player] = playerQuery(world);

        skillQuery(world).forEach(entity => {
            Object.keys(Skills).forEach(skillName => {
                const skill = Skills[skillName][entity];
                if (Input.speed[player] === 1 && skill[SkillProps.Level] > 0) {
                    if (skill[SkillProps.Cooldown] > 0) {
                        skill[SkillProps.Cooldown] -= delta;
                    }
                }
            });
        });
    });
};
