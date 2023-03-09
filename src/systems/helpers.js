import { Position, Size, Stats } from '../components';
import { MELEE_ATTACK_RANGE, RANGED_ATTACK_RANGE } from '../const';

// export const checkOverlap = (entity1, entity2) =>
//     Position.x[entity1] + Size.width[entity1]/2 + Size.width[entity2]/2 > Position.x[entity2];

export const clamp = (value, min = 0, max = Infinity) =>
    Math.max(min, Math.min(max, value));

export const isDead = entity => Stats.hp[entity] <= 0;

export const atMeleeRange = (entity, player) =>
    Position.x[entity] <= Position.x[player] + MELEE_ATTACK_RANGE;

// export const withinMeleeRange = (entity, player) =>
//     Position.x[entity] < Position.x[player] + MELEE_ATTACK_RANGE + 10;

// export const inRangedRange = (entity, player) =>
//     Position.x[entity] < Position.x[player] + RANGED_ATTACK_RANGE;

export const coolDownFromAtkSpeed = attackSpeed => 1000 / attackSpeed;
