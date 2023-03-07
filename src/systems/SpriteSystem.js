import {
    addComponent,
    defineQuery,
    defineSystem,
    enterQuery,
    exitQuery,
    Not,
    removeComponent,
    removeEntity
} from 'bitecs';
import { Attack, AttackedMelee, Dead, HitMelee, Player, Position, Sprite, Stats, Walk } from '../components';
import { ATTACK_HIT_FRAME } from '../entities/Zombie';

const timeScale = 1;

export default (scene, textures) => {
    const playerQuery = defineQuery([Player,]);
    const spriteQuery = defineQuery([Position, Sprite,]);
    const walkQuery = defineQuery([Walk,]);
    const attackQuery = defineQuery([Attack,]);
    const deadQuery = defineQuery([Dead,]);
    const idleQuery = defineQuery([Not(Dead), Not(Walk), Not(Attack),]);
    const attackedMeleeQuery = defineQuery([AttackedMelee,]);
    const attackedMeleeQueryExit = enterQuery(attackedMeleeQuery);
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

        walkQuery(world).forEach(entity => {
            // entity === player && console.log('Walk play')
            const textureName = textureNameByEntity(entity);
            const sprite = spritesByEntity.get(entity);

            if (sprite) {
                sprite.play({
                    key: `${textureName}Walk`,
                    timeScale
                }, true);
            }
        });

        attackedMeleeQueryExit(world).forEach(entity => {
            // Do we need this?
            const sprite = spritesByEntity.get(AttackedMelee.attacker[entity]);
            if (sprite) {
                sprite.off(Phaser.Animations.Events.ANIMATION_UPDATE);
            }
        });
        attackedMeleeQuery(world).forEach(entity => {
            const sprite = spritesByEntity.get(AttackedMelee.attacker[entity]);
            if (sprite) {
                sprite.on(Phaser.Animations.Events.ANIMATION_UPDATE, (anim, frame) => {
                    // console.log('Animation update!', anim.key, frame.index, frameKey);
                    if (anim.key.endsWith('Attack') && frame.index === ATTACK_HIT_FRAME) {
                        addComponent(world, HitMelee, entity);
                        console.log('HIT!');
                    }
                });
            }
        });

        attackQuery(world).forEach(entity => {
            // entity === player && console.log('Attack play')
            const textureName = textureNameByEntity(entity);
            const sprite = spritesByEntity.get(entity);

            if (sprite) {
                sprite.play({
                    key: `${textureName}Attack`,
                    timeScale: Stats.attackSpeed[entity] / 2
                }, true);
            }
        });

        deadQuery(world).forEach(entity => {
            const textureName = textureNameByEntity(entity);
            const sprite = spritesByEntity.get(entity);

            if (sprite) {
                sprite.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    // removeComponent(world, Dead, entity);
                    removeEntity(world, entity);
                });

                sprite
                    .play({
                        key: `${textureName}Dead`,
                        timeScale
                    }, true);
            }
        });

        idleQuery(world).forEach(entity => {
            const textureName = textureNameByEntity(entity);
            const sprite = spritesByEntity.get(entity);
            if (sprite) {
                sprite.play({
                    key: `${textureName}Idle`,
                    timeScale
                }, true);
            }
        });

        spriteQueryExit(world).forEach(entity => {
            console.log('EXIT SPRITE', entity)
            spritesByEntity.delete(entity);
        });

        return world;
    });
}
