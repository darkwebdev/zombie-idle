import { Buttons, Label } from 'phaser3-rex-plugins/templates/ui/ui-components';
import { ModalBehavoir } from 'phaser3-rex-plugins/plugins/modal.js';
import { addButtonToContainer, addSpacerToContainer } from './helpers';
import { Levels } from '../../const';

const MenuStates = {
    Idle: 'IDLE',
    Open: 'OPEN',
    Closed: 'CLOSE',
};

const OpenTransitions = {
    PopUp: 'popUp',
    FadeIn: 'fadeIn',
};
const CloseTransitions = {
    ScaleDown: 'scaleDown',
    FadeOut: 'fadeOut',
};

export const MainMenu = (scene) => {
    const background = scene.add.image(0, 0, 'ui', 'panel_blue.png');
    const buttons = new Buttons(scene, {
        x: scene.scale.width/2,
        y: scene.scale.height/2,
        orientation: 'y',
        background,
        space: {
            left: 20, right: 20, top: 15, bottom: 15,
            item: 6
        },
    });
    const modal = new ModalBehavoir(background, {
        cover: {
            color: 0x000000,
            alpha: 0.8,
        },
        touchOutsideClose: true,
        manualClose: true,

        duration: {
            in: 100,
            out: 100,
        },
        openOnStart: true,
        destroy: false,

        // transitIn: OpenTransitions.PopUp,
        // transitOut: CloseTransitions.ScaleDown,
    });
    modal.cover.setDepth(10);

    addMenuButton('Recruit Level', () => {
        console.log('Recruit level...');
        scene.scene.start(Levels.Recruit);
    });
    addMenuButton('Guard Level', () => {
        scene.scene.start(Levels.Guard);
    });
    addMenuSpacer();

    addMenuButton('Continue', () => {
        close();
    });

    scene.input.keyboard.on('keydown-ESC', toggle);

    const menu = scene.add
        .existing(buttons)
        .setOrigin(0.5, 0.5)
        .setScrollFactor(0)
        .setDepth(11)
        .layout()
        // .setVisible(false);

    console.log(modal.state)
    // modal.requestClose();

    return {
        open,
        close,
        toggle
    }

    function open() {
        //todo: pause
        modal.requestOpen();
        menu.setVisible(true);
    }

    function close() {
        modal.requestClose();
        menu.setVisible(false);
        //todo: unpause
    }

    function toggle() {
        switch (modal.state) {
            case MenuStates.Open:
                return close();
            case MenuStates.Closed:
            case MenuStates.Idle:
                return open();
            default:
                return close();
        }
    }

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
