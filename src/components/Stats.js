import { defineComponent, Types } from 'bitecs';

export default defineComponent({
    hp: Types.i32,
    maxHp: Types.ui16,
    attack: Types.ui16,
    attackSpeed: Types.ui16, // x/sec
    hitChance: Types.ui8, // %
    criticalChance: Types.ui8, // %
    criticalDamage: Types.ui16,
});
