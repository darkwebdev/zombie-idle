import { defineQuery, defineSystem, enterQuery, exitQuery } from 'bitecs';
import { Player, Position, Sprite, Stats } from '../components';
import { clamp } from './helpers';

const BAR_FILL_COLOR = 0x2ecc71;
const BAR_BORDER_COLOR = 0x000000;
const BAR_BORDER_WIDTH = 2;
const BAR_WIDTH = 100;
const BAR_HEIGHT = 10;
const BAR_DISTANCE = 10;

const barX = x => x - BAR_WIDTH / 2;
const barY = y => y + BAR_DISTANCE;

export default (scene) => {
    const playerQuery = defineQuery([Player,]);
    const barQuery = defineQuery([Position, Stats, Sprite,]);
    const barQueryEnter = enterQuery(barQuery);
    const barQueryExit = exitQuery(barQuery);
    const bars = new Map();

    const drawBarBg = (x, y) =>
        scene.add
            .graphics()
            .setPosition(x-BAR_BORDER_WIDTH, y-BAR_BORDER_WIDTH)
            .fillStyle(BAR_BORDER_COLOR, 1)
            .fillRect(0, 0, BAR_WIDTH+BAR_BORDER_WIDTH*2, BAR_HEIGHT+BAR_BORDER_WIDTH*2);

    const drawBar = (x, y, color) =>
        scene.add
            .graphics()
            .setPosition(x, y)
            .fillStyle(color, 1)
            .fillRect(0, 0, BAR_WIDTH, BAR_HEIGHT);

    return defineSystem((world) => {
        const [player] = playerQuery(world);

        barQueryEnter(world).forEach(entity => {
            if (Stats.hp[entity] !== undefined) {
                const scrollFactorX = entity === player ? 0 : 1;
                const x = Position.x[entity];
                const y = Position.y[entity];
                const bar = drawBar(barX(x), barY(y), BAR_FILL_COLOR).setScrollFactor(scrollFactorX, 0);
                if (entity !== player) {
                    const overlappingBarsNumber = Array
                        .from(bars.keys())
                        .filter(key => key !== player && bars.get(key).x === barX(x))
                        .length;
                    const adjustedBarY = barY(y) + (BAR_HEIGHT+2) * overlappingBarsNumber;
                    bar.setY(adjustedBarY);
                    console.log('y', adjustedBarY, 'barX', barX(x), entity)
                }
                // drawBarBg(freeX, y).setScrollFactor(scrollFactorX, 0);
                bars.set(entity, bar);
            }
        });

        barQuery(world).forEach(entity => {
            const bar = bars.get(entity);
            if (bar) {
                if (entity !== player) {
                    const overlappingBars = Array
                        .from(bars.keys())
                        .filter(key => key !== player && bars.get(key).x === bar.x);
                    const index = overlappingBars.indexOf(entity);
                    if (index > -1) {
                        const adjustedBarY = barY(Position.y[entity]) + (BAR_HEIGHT+2) * index;
                        bar.setY(adjustedBarY);
                    }
                }
                bar.setScale(clamp(Stats.hp[entity]) / Stats.maxHp[entity], 1);
            }
        });

        barQueryExit(world).forEach(entity => {
            bars.delete(entity);
        });

        return world;
    });
}
