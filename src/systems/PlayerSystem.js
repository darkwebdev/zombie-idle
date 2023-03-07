import { defineQuery, defineSystem } from 'bitecs';
import { Input, Player } from '../components';

export default () => {
    const query = defineQuery([Player, Input]);

    return defineSystem(world => {
        const [player] = query(world)

        if (Input.autoplay[player]) {
            Input.speed[player] = 1;
        }

        // player interaction logic here

        return world;
    });
}
