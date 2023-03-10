import { defineComponent, Types } from 'bitecs';
import { SkillNames } from '../const';

export default defineComponent({
    // name: [level, cooldown]
    [SkillNames.Attack]: [Types.ui16, Types.ui8],
    [SkillNames.CrowdAttack]: [Types.ui16, Types.ui8],
    [SkillNames.RangedAttack]: [Types.ui16, Types.ui8],
});
