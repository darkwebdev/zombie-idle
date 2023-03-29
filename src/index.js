import { Game, AUTO } from 'phaser';
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import DebugDrawPlugin from 'phaser-plugin-debug-draw';
import SceneWatcherPlugin from 'phaser-plugin-scene-watcher';
import { GuardLevel } from './scenes/guard';
import { RecruitLevel } from './scenes/recruit';

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
        global: [
            {
                key: 'SceneWatcher',
                plugin: SceneWatcherPlugin,
                start: true
            }
        ],
        scene: [
            {
                key: 'rexUI',
                plugin: UIPlugin,
                mapping: 'rexUI'
            },
            {
                key: 'DebugDrawPlugin',
                plugin: DebugDrawPlugin,
                mapping: 'debugDraw'
            }
        ]
    },
    callbacks: {
        postBoot: function(game) {
            // For each scene, it shows (left to right):
            // key, status, display list count, update list count,
            // active (a), visible (v), transitioning (t),
            // input active (i), keyboard input active (k)
            game.plugins.get('SceneWatcher').watchAll();
        }
    },
    scene: [GuardLevel, RecruitLevel]
};

window.game = new Game(config);
