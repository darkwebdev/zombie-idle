import { defineQuery, defineSystem, enterQuery } from 'bitecs';
import { Player, Position, Sprite, Stats } from '../components';
import { clamp } from './helpers';

const BAR_FILL_COLOR = 0x2ecc71;
const BAR_BORDER_COLOR = 0x000000;
const BAR_BORDER_WIDTH = 2;
const BAR_WIDTH = 100;
const BAR_HEIGHT = 10;
const BAR_DISTANCE = 10;

export default (scene) => {
    const playerQuery = defineQuery([Player,]);
    const barQuery = defineQuery([Position, Stats, Sprite,]);
    const barQueryEnter = enterQuery(barQuery);
    const bars = new Map();

    const drawBarBg = (x, y) =>
        scene.add
            .graphics()
            .setPosition(x-BAR_WIDTH/2-BAR_BORDER_WIDTH, y+BAR_DISTANCE-BAR_BORDER_WIDTH)
            .fillStyle(BAR_BORDER_COLOR, 1)
            .fillRect(0, 0, BAR_WIDTH+BAR_BORDER_WIDTH*2, BAR_HEIGHT+BAR_BORDER_WIDTH*2);

    const drawBar = (x, y, color) =>
        scene.add
            .graphics()
            .setPosition(x-BAR_WIDTH/2, y+BAR_DISTANCE)
            .fillStyle(color, 1)
            .fillRect(0, 0, BAR_WIDTH, BAR_HEIGHT);

    return defineSystem((world) => {
        const [player] = playerQuery(world);

        barQueryEnter(world).forEach(entity => {
            if (Stats.hp[entity] !== undefined) {
                const scrollFactorX = entity === player ? 0 : 1;
                drawBarBg(Position.x[entity], Position.y[entity]).setScrollFactor(scrollFactorX, 0);
                const bar = drawBar(Position.x[entity], Position.y[entity], BAR_FILL_COLOR).setScrollFactor(scrollFactorX, 0);
                bars.set(entity, bar);
            }
        });

        barQuery(world).forEach(entity => {
            const bar = bars.get(entity);
            if (bar) {
                bar.scaleX = clamp(Stats.hp[entity]) / Stats.maxHp[entity];
            }
        });

        barQueryEnter(world).forEach(entity => {
            bars.delete(entity);
        });

        return world;
    });
}
