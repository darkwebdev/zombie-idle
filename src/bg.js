export const createBg = (scene) => {
    const { width } = scene.scale;
    const imgWidth = scene.textures.get('sky').getSourceImage().width;
    const imgHeight = scene.textures.get('sky').getSourceImage().height;

    scene.add
        .tileSprite(0, 0, width, imgHeight, 'sky')
        .setOrigin(0, 0)
        .setScrollFactor(0);

    const buildings = [];
    for (let line = 0; line < 4; line++) {
        buildings.push([]);
        for (let screen = 0; screen < 8; screen++) {
            const building = scene.add
                .sprite(imgWidth * screen, 0, `building${line}${screen}`)
                .setOrigin(0, 0)
                .setScrollFactor((line+1)*0.25, 0);
            buildings[line].push(building);
        }
    }
}
