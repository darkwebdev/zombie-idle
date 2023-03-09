import { defineComponent, Types } from 'bitecs';

export default defineComponent({
    // name: [level, cooldown]
    attack: [Types.ui16, Types.ui8],
    crowdAttack: [Types.ui16, Types.ui8],
    rangedAttack: [Types.ui16, Types.ui8],
});
