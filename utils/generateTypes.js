const { resolve } = require("path");
const { removeExtension } = require("./extension");
const fs = require("fs-extra");
const { type } = require("os");

function setCharAt(str, index, chr) {
    if (index > str.length - 1) return str;
    return str.substring(0, index) + chr + str.substring(index + 1);
}

const enumTypes = () => {
    const layersPath = resolve(process.cwd(), "layers");
    const layers = fs.readdirSync(layersPath);
    let enumStrings = [[]];
    let layerPath;
    layerIndex = 0;
    layers.forEach((layer) => {
        if (layer.charAt(0) != ".") {
            layerPath = resolve(layersPath, layer);
            currentLayer = fs.readdirSync(layerPath);
            currentLayer.forEach((file) => {
                if (file.charAt(0) != ".") {
                    file = removeExtension(file);
                    file = file.toUpperCase();
                    enumStrings[layerIndex].push(file);
                }
            });
            enumStrings.push([]);
            layerIndex += 1;
        }
    });

    return { enumStrings: enumStrings, len: layers.length };
};

const generateEnumTypes = () => {
    types = enumTypes();
    layerLen = [];
    let count = 0;
    let background = types.enumStrings[0];
    let catType = types.enumStrings[1];
    let planet = types.enumStrings[2];

    for (let i = 0; i < background.length; i++) {
        for (let j = 0; j < catType.length; j++) {
            for (let k = 0; k < planet.length; k++) {
                console.log(`${background[i]}_${catType[j]}_${planet[k]},`);
                count += 1;
            }
        }
    }
};

const generateIpfsPath = () => {
    const metadataPath = `${process.cwd()}/build/metadata`;
    const files = fs.readdirSync(metadataPath);
    const cid = "bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u";
    files.forEach((file) => {
        console.log(`\"ipfs://${cid}/${file}\",`);
    });
};

generateIpfsPath();
