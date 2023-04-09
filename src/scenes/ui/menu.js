import { Buttons, Label } from 'phaser3-rex-plugins/templates/ui/ui-components';
import { addButtonToContainer, addSpacerToContainer } from './helpers';
import { Levels } from '../../const';

export const MainMenu = (scene) => {
    const buttons = new Buttons(scene, {
        x: scene.scale.width/2,
        y: scene.scale.height/2,
        orientation: 'y',
        background: scene.add.image(0, 0, 'ui', 'panel_blue.png'),
        space: {
            left: 20, right: 20, top: 15, bottom: 15,
            item: 6
        },
    });

    addMenuButton('Recruit Level', () => {
        console.log('Recruit level...');
        scene.scene.start(Levels.Recruit);
    });
    addMenuButton('Guard Level', () => {
        scene.scene.start(Levels.Guard);
    });
    addMenuSpacer();
    addMenuButton('Continue', () => {
        buttons.setVisible(false);
    });

    scene.input.keyboard.on('keydown-ESC', () => {
        buttons.setVisible(!buttons.visible);
    });

    return scene.add
        .existing(buttons)
        .setOrigin(0.5, 0.5)
        .setScrollFactor(0)
        .layout()
        .setVisible(false);

    function addMenuSpacer() {
        addSpacerToContainer(scene, buttons);
    }
    function addMenuButton(text, onPress) {
        addButtonToContainer(buttons, createButton(scene, text), onPress);
    }
}

function createButton(scene, text = '') {
    const background = scene.add.image(0, 0, 'ui', 'buttonLong_blue_pressed.png').setOrigin(0, 1);
    const fxShadow = background.preFX.addShadow(0, -2, 0.01, 1, 0x333333, 10);

    const label = new Label(scene, {
        width: 100,
        height: 47,
        background,
        text: scene.add.text(0, 0, text, { fontSize: 18 }),
        space: {
            left: 20,
            right: 20,
        },
        align: 'center'
    });

    label.shadow = fxShadow;

    return scene.add.existing(label);
}
