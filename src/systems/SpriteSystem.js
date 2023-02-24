import { defineQuery, defineSystem, enterQuery, exitQuery } from 'bitecs';
import { Player, Position, Sprite, Animation, Stats } from '../components';
import { AnimationStates } from '../const';

const timeScale = 1;

export default (scene, textures, onDeath = () => {}) => {
    const playerQuery = defineQuery([Player,]);
    const spriteQuery = defineQuery([Position, Sprite,]);
    const animationQuery = defineQuery([Animation,]);
    const spriteQueryEnter = enterQuery(spriteQuery);
    const spriteQueryExit = exitQuery(spriteQuery);

    const spritesByEntity = new Map();
    const textureNameByEntity = entity => textures[Sprite.texture[entity]];

    return defineSystem(world => {
        const [player] = playerQuery(world);

        spriteQueryEnter(world).forEach(entity => {
            const textureName = textureNameByEntity(entity);
            const sprite = scene.add
                .sprite(0, 0, textureName)
                .setScale(0.5)
                .setOrigin(0.5, 1);
            spritesByEntity.set(entity, sprite);
            if (entity === player) {
                scene.cameras.main.startFollow(sprite, false, 1, 1, -300, 150);
            }
        });

        spriteQuery(world).forEach(entity => {
            const sprite = spritesByEntity.get(entity);
            if (sprite) {
                sprite.setPosition(Position.x[entity], Position.y[entity]);
            } else {
                console.error('Sprite not found for entity', entity);
            }
        });

        animationQuery(world).forEach(entity => {
            const textureName = textureNameByEntity(entity);
            const sprite = spritesByEntity.get(entity);
            if (sprite) {
                switch (Animation.state[entity]) {
                    case AnimationStates.Idle:
                        return sprite.play({
                            key: `${textureName}Idle`,
                            timeScale
                        }, true);
                    case AnimationStates.Walk:
                        return sprite.play({
                            key: `${textureName}Walk`,
                            timeScale
                        }, true);
                    case AnimationStates.Attack:
                        return sprite.play({
                            key: `${textureName}Attack`,
                            timeScale: Stats.attackSpeed[entity]/2
                        }, true);
                    case AnimationStates.Dead:
                        sprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                            onDeath(entity);
                        });

                        return sprite.play({
                            key: `${textureName}Dead`,
                            timeScale
                        }, true);
                }
            }
        });

        spriteQueryExit(world).forEach(entity => {
            console.log('EXIT SPRITE', entity)
            spritesByEntity.delete(entity);
        });

        return world;
    });
}
