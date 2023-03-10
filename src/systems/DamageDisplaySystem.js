import { defineQuery, defineSystem, enterQuery } from 'bitecs';
import { Damage, Position, Size } from '../components';

const damageStyle = {
    fontFamily: 'Arial Black',
    fontSize: '40px',
    color: '#00aa00',
    stroke: '#000',
    strokeThickness: 2,
};
const missStyle = {
    ...damageStyle,
    fontSize: '30px',
    color: '#aaaaaa',
};
const critStyle = {
    ...damageStyle,
    fontSize: '50px',
    color: '#aa0000',
};

const resetDamage = entity => {
    Damage.value[entity] = -1;
    Damage.isMiss[entity] = 0;
    Damage.isCritical[entity] = 0;
}

export default (scene) => {
    const damageQuery = defineQuery([Damage, Position, Size,]);
    const damageQueryEnter = enterQuery(damageQuery);

    return defineSystem((world) => {
        damageQueryEnter(world).forEach(entity => {
            resetDamage(entity);
        });
        damageQuery(world).forEach(entity => {
            const damageValue = Damage.value[entity];
            const isMiss = Damage.isMiss[entity] === 1;
            const isCrit = Damage.isCritical[entity] === 1;
            resetDamage(entity);

            if (damageValue >= 0 || isMiss) {
                const damage = isMiss ? 'Miss' : damageValue;
                console.log('Damage system:', damage)
                const x = Position.x[entity];
                const y = Position.y[entity] - Size.height[entity] - 10;
                const style = isMiss ? missStyle : isCrit ? critStyle : damageStyle;
                const damageText = scene.add.text(x, y, damage, style);

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
