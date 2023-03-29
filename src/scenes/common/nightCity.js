const TOTAL_SCREENS = 8;
const TOTAL_LINES = 4;
const SkyTexture = 'sky';

export const loadBg = scene => {
    scene.load.image(SkyTexture, 'assets/bg/1/Night/1.png');
    for (let line = 0; line < TOTAL_LINES; line++) {
        for (let screen = 0; screen < TOTAL_SCREENS; screen++) {
            scene.load.image(`building${line}${screen}`, `assets/bg/${screen + 1}/Night/${line + 2}.png`);
        }
    }
}

export const createBg = (scene) => {
    const { width } = scene.scale;
    const imgWidth = scene.textures.get(SkyTexture).getSourceImage().width;
    const imgHeight = scene.textures.get(SkyTexture).getSourceImage().height;

    scene.add
        .tileSprite(0, 0, width, imgHeight, SkyTexture)
        .setOrigin(0, 0)
        .setScrollFactor(0);
    const buildings = [];
    for (let line = 0; line < TOTAL_LINES; line++) {
        buildings.push([]);
        for (let screen = 0; screen < TOTAL_SCREENS; screen++) {
            const building = scene.add
                .sprite(imgWidth * screen, 0, `building${line}${screen}`)
                .setOrigin(0, 0)
                .setScrollFactor((line+1)*0.25, 0);
            buildings[line].push(building);
        }
    }
}
