const basePath = process.cwd();
const {
    generateImages,
    buildDirs,
} = require(`${basePath}/utils/generateImages.js`);

const main = () => {
    buildDirs();
    generateImages();
};

main();
