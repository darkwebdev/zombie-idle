import { defineComponent, Types } from 'bitecs';

export const Position = defineComponent({
    x: Types.ui32,
    y: Types.ui16,
});

export const Velocity = defineComponent({
    x: Types.ui16,
});

export const Size = defineComponent({
    width: Types.ui16,
    height: Types.ui16,
});
