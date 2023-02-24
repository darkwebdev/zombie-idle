import { defineQuery, defineSystem } from 'bitecs';
import { Input, Position, Velocity, Animation, Player } from '../components';
import { AnimationStates } from '../const';
import { atMeleeRange, isDead } from './helpers';

export default () => {
    const playerQuery = defineQuery([Player,]);
    const movementQuery = defineQuery([Position, Animation, ]);

    return defineSystem((world) => {
        let atMeleeAttackRange = false;
        const [player] = playerQuery(world);

        movementQuery(world).forEach(entity => {
            if (isDead(entity)) {
                Animation.state[entity] = AnimationStates.Dead;
                return;
            }
            if (Input.speed[player] === 0) {
                Animation.state[entity] = AnimationStates.Idle;
                return;
            }

            if (entity !== player) {
                if (atMeleeRange(entity, player)) {
                    atMeleeAttackRange = true;
                } else if (Velocity.x[entity]){
                    updateAnimatedPosition(entity, true);
                }
            }

        });

        const isPlayerWalking = Input.speed[player] === 1 && Velocity.x[player] && !atMeleeAttackRange;
        updateAnimatedPosition(player, isPlayerWalking);

        return world;
    });
}

const updateAnimatedPosition = (entity, isWalking = false) => {
    if (isWalking) {
        Position.x[entity] += Velocity.x[entity];
        Animation.state[entity] = AnimationStates.Walk;
    }
}
