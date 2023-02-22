import { Position, Size, Stats } from '../components';

export const checkOverlap = (entity1, entity2) =>
    Position.x[entity1] + Size.width[entity1]/2 + Size.width[entity2]/2 > Position.x[entity2];

export const clamp = (value, min = 0, max = Infinity) =>
    Math.max(min, Math.min(max, value));

export const isDead = entity => Stats.hp[entity] <= 0;
