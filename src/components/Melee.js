import { defineComponent, Types } from 'bitecs';

export const HitMelee = defineComponent();

export const AttackedMelee = defineComponent({
    attacker: Types.eid
});
