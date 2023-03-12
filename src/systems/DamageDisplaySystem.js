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
    fontSize: '20px',
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

const avoidOverlapping = (minPos, curText) => {
    console.log('DMG trying', minPos.x, minPos.y, curText.x, curText.y);
    const curTextRight = curText.x + curText.width + 10;
    const curTextBottom = curText.y + curText.height - 10;
    const overlappingX = curTextRight >= minPos.x;
    const overlappingY = curTextBottom >= minPos.y;
    return (overlappingX && overlappingY) ? { x: curTextRight, y: minPos.y } : minPos;
};

export default (scene) => {
    const damageQuery = defineQuery([Damage, Position, Size,]);
    const damageQueryEnter = enterQuery(damageQuery);
    const textQ = [];

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
                const freePos = textQ.reduce(avoidOverlapping, { x, y });
                damageText.setX(freePos.x).setY(freePos.y);
                textQ.push(damageText);
                // console.log('DMG Q', textQ.map(text => text.text), freePos.x, freePos.y);

                scene.tweens.addCounter({
                    from: 0,
                    to: 100,
                    ease: 'linear',
                    duration: 2000,
                    repeat: 0,
                    yoyo: false,
                    onUpdate: tween => {
                        const counter = tween.getValue();
                        damageText
                            .setX(freePos.x - (freePos.x - x)/counter)
                            .setY(y - counter * 2)
                            .setAlpha(1 - counter/100);
                    },
                    onComplete: () => {
                        textQ.shift();
                        damageText.destroy();
                    }
                });
            }
        });

        return world;
    });
}
