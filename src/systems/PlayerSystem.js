import { defineQuery, defineSystem } from 'bitecs';
import { Input, Player } from '../components';

export default (cursors) => {
    const query = defineQuery([Player, Input]);

    return defineSystem(world => {
        const [player] = query(world)

        Input.speed[player] = cursors.right.isDown ? 1 : 0;

        return world;
    });
}
