import { Buttons, Label } from 'phaser3-rex-plugins/templates/ui/ui-components';
import { addButtonToContainer } from './helpers';

export const loadUi = scene => {
    scene.load.atlas('ui', 'assets/ui.png', 'assets/ui.json');
    scene.load.atlas('icons', 'assets/icons.png', 'assets/icons.json');
}

export const createUI = ({ scene, menu, player, InputDebug, InputAutoplay, InputSpeed }) => {
    const buttons = new Buttons(scene, {
        x: 0,
        y: 0,
        orientation: 'x',
        space: {
            left: 0, right: 0, top: 0, bottom: 0,
            item: 6
        },
    });

    addMenuButton('gear.png', () => {
        menu.open();
    });
    addMenuButton('right.png', () => {
        console.log('PLAY')
        InputAutoplay[player] = 1;
    });
    addMenuButton('pause.png', () => {
        console.log('PAUSE')
        InputAutoplay[player] = 0;
    });

    scene.add
        .existing(buttons)
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .layout();

    function addMenuButton(icon, onPress) {
        addButtonToContainer(buttons, createButton(scene, icon), onPress);
    }
}

function createButton(scene, icon, isPressed = false) {
    const background = scene
        .add.image(0, 0, 'ui', 'buttonSquare_blue_pressed.png')
        .setOrigin(0.5, 0.5);
    const fxShadow = background.preFX.addShadow(0, -6, 0.01, 2, 0x222222, 10);
    const label = new Label(scene, {
        width: 45,
        height: 47,
        background,
        icon: scene.add.image(0, 0, 'icons', icon),
        // iconSize: 40,
        squareFitIcon: true,
        space: {
            left: 0,
            right: 0,
            bottom: 0,
            top: isPressed ? 3 : 0,
            icon: 10,
        },
        align: 'center'
    });
    label.shadow = fxShadow;

    return scene.add.existing(label);
}
