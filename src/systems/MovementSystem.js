import { addComponent, defineQuery, defineSystem, removeComponent } from 'bitecs';
import { Input, Position, Velocity, Player, Dead, Walk, AtMeleeRange } from '../components';
import { atMeleeRange, isDead } from './helpers';

export default () => {
    const playerQuery = defineQuery([Player,]);
    const movementQuery = defineQuery([Position, Velocity,]);
    const atMeleeRangeQuery = defineQuery([AtMeleeRange, ]);

    return defineSystem((world) => {
        const [player] = playerQuery(world);

        movementQuery(world).forEach(entity => {
            if (isDead(entity)) {
                addComponent(world, Dead, entity);
                return;
            }
            if (Input.speed[player] === 0) {
                removeComponent(world, Walk, entity);
                return;
            }

            if (entity !== player) {
                if (atMeleeRange(entity, player)) {
                    addComponent(world, AtMeleeRange, entity);
                    removeComponent(world, Walk, entity);
                } else if (Velocity.x[entity]){
                    removeComponent(world, AtMeleeRange, entity);
                    addComponent(world, Walk, entity);
                    Position.x[entity] -= Velocity.x[entity];
                }
            }
        });

        const isPlayerWalking = Input.speed[player] === 1 && Velocity.x[player] && !atMeleeRangeQuery(world).length;
        if (isPlayerWalking) {
            Position.x[player] += Velocity.x[player];
            addComponent(world, Walk, player);
        } else {
            removeComponent(world, Walk, player);
        }

        return world;
    });
}
