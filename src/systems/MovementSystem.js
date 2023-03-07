import { addComponent, defineQuery, defineSystem, removeComponent } from 'bitecs';
import { Input, Position, Velocity, Player, Dead, Walk, AtMeleeRange } from '../components';
import { atMeleeRange, isDead } from './helpers';

export default () => {
    const playerQuery = defineQuery([Player,]);
    const movementQuery = defineQuery([Position, ]);
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
                } else if (Velocity.x[entity]){
                    removeComponent(world, AtMeleeRange, entity);
                    updateAnimatedPosition(world, entity, true);
                }
            }
        });

        const isPlayerWalking = Input.speed[player] === 1 && Velocity.x[player] && !atMeleeRangeQuery(world).length;
        updateAnimatedPosition(world, player, isPlayerWalking);

        return world;
    });
}

const updateAnimatedPosition = (world, entity, isWalking = false) => {
    if (isWalking) {
        Position.x[entity] += Velocity.x[entity];
        addComponent(world, Walk, entity);
    } else {
        removeComponent(world, Walk, entity);
    }
}
