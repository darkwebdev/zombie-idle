const PRELOADER_HEIGHT = 10;

export const showPreloader = scene => {
    const progress = scene.add.graphics();

    scene.load.on('progress', value => {
        progress.clear();
        progress.fillStyle(0xffffff, 1);
        progress.fillRect(0, scene.scale.height- PRELOADER_HEIGHT, scene.scale.width * value, PRELOADER_HEIGHT);
    });
    scene.load.on('complete', () => {
        progress.destroy();
    });
};
