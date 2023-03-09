import { defineQuery, defineSystem, enterQuery } from 'bitecs';
import { Damage, Position, Size } from '../components';

const style = {
    fontFamily: 'Arial Black',
    fontSize: '40px',
    color: '#aa0000',
    stroke: '#000',
    strokeThickness: 2,
};

export default (scene) => {
    const damageQuery = defineQuery([Damage, Position, Size,]);
    const damageQueryEnter = enterQuery(damageQuery);

    return defineSystem((world) => {
        damageQueryEnter(world).forEach(entity => {
            Damage.value[entity] = -100;
        });
        damageQuery(world).forEach(entity => {
            if (Damage.value[entity] >= 0) {
                const damage = Damage.value[entity] / 100 || 'Miss!';
                console.log('Damage system', damage)
                const x = Position.x[entity];
                const y = Position.y[entity] - Size.height[entity] - 10;
                const damageText = scene.add.text(x, y, damage, style);
                Damage.value[entity] = -100;

                scene.tweens.addCounter({
                    from: 0,
                    to: 1,
                    ease: 'linear',
                    duration: 2000,
                    repeat: 0,
                    yoyo: false,
                    onUpdate: tween => {
                        const counter = tween.getValue();
                        damageText
                            .setY(y-counter*200)
                            .setAlpha(1-counter);
                    }
                });
            }
        });

        return world;
    });
}
