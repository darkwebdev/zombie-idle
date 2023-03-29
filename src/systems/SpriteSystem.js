import Phaser from 'phaser';
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
import { Attack, AttackedMelee, Dead, HitMelee, Input, Player, Position, Sprite, Stats, Walk } from '../components';
import { ATTACK_HIT_FRAME } from '../entities/Zombie';
import { DEAD_ANIM_ADJUST_Y, HIT_ANIM_ADJUST_X } from '../entities/Guard';

const timeScale = 1;

export default (scene, textures) => {
    const playerQuery = defineQuery([Player,]);
    const spriteQuery = defineQuery([Position, Sprite,]);
    const walkQuery = defineQuery([Walk,]);
    const attackQuery = defineQuery([Attack,]);
    const deadQuery = defineQuery([Dead,]);
    const idleQuery = defineQuery([Not(Dead), Not(Walk), Not(Attack), Not(HitMelee),]);
    const hitMeleeQuery = defineQuery([HitMelee,]);
    const hitMeleeQueryEnter = enterQuery(hitMeleeQuery);
    const hitMeleeQueryExit = exitQuery(hitMeleeQuery);
    const attackedMeleeQuery = defineQuery([AttackedMelee,]);
    const attackedMeleeQueryEnter = enterQuery(attackedMeleeQuery);
    const attackedMeleeQueryExit = exitQuery(attackedMeleeQuery);
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
                .setScale(0.25)
                .setOrigin(0.5, 1)
                .setDepth(1)
                .setFlipX(Sprite.isFlipped[entity] === 1)
                // .on(Phaser.Animations.Events.ANIMATION_UPDATE, (anim, frame) => {
                //     entity !== player && console.log('ANIMATION_UPDATE', anim.key, entity)
                // })
                .setInteractive()
                .on(Phaser.Input.Events.POINTER_DOWN, () => {
                    if (Input.debug[player]) {
                        addComponent(world, HitMelee, entity);
                    }
                })
            spritesByEntity.set(entity, sprite);
            if (entity === player) {
                sprite.setDepth(5);
                scene.cameras.main.startFollow(sprite, false, 1, 1, -300, 150);
            }
        });

        spriteQueryExit(world).forEach(entity => {
            const sprite = spritesByEntity.get(entity);
            sprite.off(Phaser.Input.Events.POINTER_DOWN);
            spritesByEntity.delete(entity);
            console.log('Sprite system: exit', entity, ', left', spritesByEntity.size, 'sprites.');
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
            const textureName = textureNameByEntity(entity);
            spritesByEntity.get(entity)?.play({ key: `${textureName}Walk`, timeScale }, true);
        });

        attackedMeleeQueryExit(world).forEach(entity => {
            // Do we need this?
            spritesByEntity
                .get(AttackedMelee.attacker[entity])
                ?.off(Phaser.Animations.Events.ANIMATION_UPDATE);
        });
        attackedMeleeQueryEnter(world).forEach(entity => {
            spritesByEntity
                .get(AttackedMelee.attacker[entity])
                ?.on(Phaser.Animations.Events.ANIMATION_UPDATE, (anim, frame) => {
                    if (anim.key.endsWith('Attack') && frame.index === ATTACK_HIT_FRAME) {
                        addComponent(world, HitMelee, entity);
                    }
                });
        });

        hitMeleeQueryEnter(world).forEach(entity => {
            console.log('HIT QUERY ENTER', entity)
            spritesByEntity
                .get(entity)
                ?.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    removeComponent(world, HitMelee, entity);
                });
        });
        hitMeleeQueryExit(world).forEach(entity => {
            console.log('HIT QUERY exit', entity)
            spritesByEntity.get(entity)?.stop();
        });
        hitMeleeQuery(world).forEach(entity => {
            const textureName = textureNameByEntity(entity);
            const sprite = spritesByEntity.get(entity);
            if (sprite) {
                console.log('HIT QUERY', entity, textureName)
                sprite
                    .setX(sprite.x + HIT_ANIM_ADJUST_X)
                    .setY(sprite.y + DEAD_ANIM_ADJUST_Y)
                    .play({ key: `${textureName}Hit`, timeScale }, true);
            }
        });

        attackQuery(world).forEach(entity => {
            const textureName = textureNameByEntity(entity);
            spritesByEntity.get(entity)?.play({
                key: `${textureName}Attack`,
                timeScale: Stats.attackSpeed[entity] / 2
            }, true);
        });

        deadQuery(world).forEach(entity => {
            const textureName = textureNameByEntity(entity);
            const sprite = spritesByEntity.get(entity);
            sprite
                ?.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    // removeComponent(world, Dead, entity);
                    sprite.setDepth(0);
                    console.log('Removing dead entity', entity);
                    removeEntity(world, entity);
                })
                .setY(sprite.y + DEAD_ANIM_ADJUST_Y)
                .play({ key: `${textureName}Dead`, timeScale }, true);
        });

        idleQuery(world).forEach(entity => {
            const textureName = textureNameByEntity(entity);
            spritesByEntity.get(entity)?.play({ key: `${textureName}Idle`, timeScale }, true);
        });

        return world;
    });
}
