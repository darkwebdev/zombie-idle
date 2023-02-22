import { Game, AUTO } from 'phaser';
import DebugDrawPlugin from 'phaser-plugin-debug-draw';
import { IdleZombie } from './game';

const config = {
    type: AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            debugShowBody: true,
            debugShowStaticBody: true,
            // gravity: { y: 1 },
        },
    },
    plugins: {
        scene: [
            {
                key: 'DebugDrawPlugin',
                plugin: DebugDrawPlugin,
                mapping: 'debugDraw'
            }
        ]
    },
    scene: IdleZombie
};

window.game = new Game(config);
