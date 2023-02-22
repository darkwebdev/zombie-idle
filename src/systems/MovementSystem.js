import { defineQuery, defineSystem } from 'bitecs';
import { Input, Position, Velocity, Animation, Player } from '../components';
import { AnimationStates } from '../const';
import { checkOverlap, isDead } from './helpers';

const BREAK_POINT_MELEE = 300;
const BREAK_POINT_RANGED = 600;

export default () => {
    const playerQuery = defineQuery([Player,]);
    const movementQuery = defineQuery([Position, Animation, ]);

    return defineSystem((world) => {
        let isPlayerEntityOverlapping = false;
        const [player] = playerQuery(world);

        movementQuery(world).forEach(entity => {
            let isWalking = false;

            if (isDead(entity)) {
                Animation.state[entity] = AnimationStates.Dead;
                return;
            }
            if (Input.speed[player] === 1) {
                if (entity !== player) {
                    if (checkOverlap(player, entity)) {
                        isPlayerEntityOverlapping = true;
                    } else if (Velocity.x[entity]){
                        isWalking = true;
                    }
                }
            }

            updateAnimatedPosition(entity, isWalking);
        });

        const isPlayerWalking = Input.speed[player] === 1 && Velocity.x[player] && !isPlayerEntityOverlapping;
        updateAnimatedPosition(player, isPlayerWalking);

        return world;
    });
}

const updateAnimatedPosition = (entity, isWalking = false) => {
    if (isWalking) {
        Position.x[entity] += Velocity.x[entity];
        Animation.state[entity] = AnimationStates.Walk;
    } else {
        Animation.state[entity] = AnimationStates.Idle;
    }
}
