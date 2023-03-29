import { Buttons, Label, Space } from 'phaser3-rex-plugins/templates/ui/ui-components';

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

    addMenuButton('Recruit Level');
    addMenuButton('Guard Level');
    addMenuSpacer();
    addMenuButton('Continue', () => {
        console.log('continue')
    });

    scene.add
        .existing(buttons)
        .setOrigin(0.5, 0.5)
        .layout();

    function addMenuSpacer() {
        addSpacerToContainer(scene, buttons);
    }
    function addMenuButton(text, onPress) {
        const defaultButton = createButton(scene, text);
        const pressedButton = createButton(scene, text, true);
        addButtonToContainer(buttons, defaultButton, pressedButton, onPress);
    }
}

function createButton(scene, text = '', isPressed = false) {
    const background = scene.add.image(0, 0, 'ui', isPressed ? 'buttonLong_blue_pressed.png' : 'buttonLong_blue.png').setOrigin(0, 1);
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
    return scene.add.existing(label);
}

function addSpacerToContainer(scene, container) {
    container
        .addButton(new Space(scene))
        .addButton(new Space(scene))
        .layout();
}
function addButtonToContainer(container, button, pressedButton, onPress = () => {}) {
    container
        .addButtons([button, pressedButton])
        .hideButton(pressedButton)
        .layout();

    button.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
        container
            .hideButton(button)
            .showButton(pressedButton)
            .layout();
    });
    pressedButton.on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
        container
            .hideButton(pressedButton)
            .showButton(button)
            .layout();
        onPress();
    });
}
