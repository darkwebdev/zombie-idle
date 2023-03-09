import { defineComponent, Types } from 'bitecs';

export default defineComponent({
    value: Types.i32,
    isCritical: Types.ui8,
    isMiss: Types.ui8,
});
