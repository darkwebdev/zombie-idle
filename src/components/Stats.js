import { defineComponent, Types } from 'bitecs';

export default defineComponent({
    hp: Types.i32,
    maxHp: Types.ui16,
    attackSpeed: Types.ui16, // per sec
    hitChance: Types.ui8, // % probability
    criticalChance: Types.ui8, // % probability
    criticalDamage: Types.ui16 // multiplier of Attack skill (example: attack(10) x critDmg(2) = 20 damage
});
