import { Game, AUTO } from 'phaser';
import { IdleZombie } from './game';

const config = {
    type: AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        gravity: { y: 1 }
    },
    scene: IdleZombie
};

const game = new Game(config);
