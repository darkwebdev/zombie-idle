import Phaser from 'phaser';
import { Space } from 'phaser3-rex-plugins/templates/ui/ui-components';

export function addSpacerToContainer(scene, container) {
    container
        .addButton(new Space(scene))
        .addButton(new Space(scene))
        .layout();
}

export function addButtonToContainer(container, button, onPress = () => {}) {
    const originalShadowY = button.shadow.y;

    container
        .addButton(button)
        .layout();

    const downHandler = () => {
        // console.log('down')
        button.setY(button.y + 2);
        if (button.shadow) {
            button.shadow.y = 0;
        }
        button.once(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, upHandler);
        button.once(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
            upHandler();
            onPress();
        });
    };

    const upHandler = () => {
        // console.log('up')
        if (button.shadow) {
            button.shadow.y = originalShadowY;
        }
        button.setY(button.y - 2);
        button.off(Phaser.Input.Events.GAMEOBJECT_POINTER_UP);
        button.off(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT);
    };

    button.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, downHandler);
}
