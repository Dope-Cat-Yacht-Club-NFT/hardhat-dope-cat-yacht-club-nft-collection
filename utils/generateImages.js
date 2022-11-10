const basePath = process.cwd();
const fs = require("fs-extra");
const sha1 = require("sha1");
const { createCanvas, loadImage } = require("canvas");
const { removeExtension } = require("./extension");

const buildDir = `${basePath}/build`;
const layersDir = `${basePath}/layers`;

const namePrefix = "Dope Cat Yacht Club";
const description = "Dope big cats with astronimcal views";
const baseUri = "ipfs://NFT_URI_TO_REPLACE"; // This will be replaced automatically

const IMAGE_WIDTH = 800;
const IMAGE_HEIGHT = 800;

const NFT_COLLECTION_SIZE = 200; // Background: 4 layers, CatType: 5 layers, Planet: 10 layers | 4*5*10 = 200

let uniqueShaLimit = 10000;

let metadataList = [];
let attributesList = [];
let shaList = new Set();

const SHA_DELIMITER = "-";

/**
 * @dev The sha hash is made by using the chosen png in each layer to make the name that will be hashed
 *
 * For example:
 *      The orders goes as this Background-catType-Planet
 *      (i.e.) savannah-lion-jupiter
 *      This is used as the hash for to determine if an image has already been created
 *
 * The collection size is used to determine how many unique images to generate
 */

const layerConfigs = [
    {
        collectionSize: NFT_COLLECTION_SIZE,
        layersOrder: [
            { name: "Background" },
            { name: "CatType" },
            { name: "Planet" },
        ],
    },
];

const canvas = createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
const ctx = canvas.getContext("2d");

const buildDirs = () => {
    if (fs.existsSync(buildDir)) {
        fs.removeSync(buildDir);
    }
    fs.mkdirSync(buildDir);
    fs.mkdirSync(`${buildDir}/metadata`);
    fs.mkdirSync(`${buildDir}/images`);
};

const getLayers = (path) => {
    return fs
        .readdirSync(path)
        .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
        .map((i, index) => {
            return {
                id: index,
                name: removeExtension(i),
                filename: i,
                path: `${path}${i}`,
            };
        });
};

const getElements = (path) => {
    return fs
        .readdirSync(path)
        .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
        .map((i, index) => {
            return {
                id: index,
                name: removeExtension(i),
                filename: i,
                path: `${path}${i}`,
            };
        });
};

const layersSetup = (layersOrder) => {
    const layers = layersOrder.map((layerObj, index) => ({
        id: index,
        elements: getElements(`${layersDir}/${layerObj.name}/`),
        name:
            layerObj.options?.["displayName"] != undefined
                ? layerObj.options?.["displayName"]
                : layerObj.name,
        blend:
            layerObj.options?.["blend"] != undefined
                ? layerObj.options?.["blend"]
                : "source-over",
        opacity:
            layerObj.options?.["opacity"] != undefined
                ? layerObj.options?.["opacity"]
                : 1,
    }));
    return layers;
};

const saveImage = (_versionName) => {
    fs.writeFileSync(
        `${buildDir}/images/${_versionName}.png`,
        canvas.toBuffer("image/png")
    );
};

const drawElement = (_renderObject, _index, _layersLen) => {
    ctx.globalAlpha = _renderObject.layer.opacity;
    ctx.globalCompositeOperation = _renderObject.layer.blend;

    ctx.drawImage(_renderObject.loadedImage, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

    addAttributes(_renderObject);
};

const cleanSha = (_str) => {
    let sha = Number(_str.split(":").shift());
    return sha;
};

/**
 *
 * @param { calculated hash } _sha
 * @param { layers selected from hash to form image } _layers
 * @returns {}
 */
const mapLayerToHash = (_sha = "", _layers = []) => {
    let mappedShaToLayers = _layers.map((layer, index) => {
        let selectedElement = layer.elements.find(
            (e) => e.filename == _sha.split(SHA_DELIMITER)[index]
        );

        return {
            name: layer.name,
            blend: layer.blend,
            opacity: layer.opacity,
            selectedElement: selectedElement,
        };
    });
    return mappedShaToLayers;
};

/**
 *
 * @param { string } _sha a calculated hash
 * @param { string } _edition number in collection
 * @param { array } _filenameArray an array containing filenames of generated images
 */
const addMetadata = async (_sha, _edition, _filenameArray) => {
    let tempMetadata = {
        name: `${namePrefix} #${_edition}: A Dope ${_filenameArray[1].toLowerCase()} chillen in the ${_filenameArray[0].toLowerCase()} looking at ${_filenameArray[2].toLowerCase()}`,
        description: description,
        image: `${baseUri}/${_filenameArray[0]}-${_filenameArray[1]}-${_filenameArray[2]}.png`,
        attributes: attributesList,
        sha: sha1(_sha),
        edition: _edition,
        date: Date.now(),
    };
    metadataList.push(tempMetadata);
    attributesList = [];
};

/**
 *
 * @param { object } _element elements for attribute
 */
const addAttributes = (_element) => {
    let selectedElement = _element.layer.selectedElement;
    attributesList.push({
        trait_type: _element.layer.name,
        value: selectedElement.name,
    });
};

const loadLayerImg = async (_layer) => {
    return new Promise(async (resolve) => {
        const image = await loadImage(`${_layer.selectedElement.path}`);

        resolve({ layer: _layer, loadedImage: image });
    });
};

const writeMetaData = (_data) => {
    fs.writeFileSync(`${buildDir}/metadata/_metadata.json`, _data);
};

const saveMetaDataSingleFile = (_editionCount, _filenameArray) => {
    let metadata = metadataList.find((meta) => meta.edition == _editionCount);
    fs.writeFileSync(
        `${buildDir}/metadata/${_filenameArray[0]}-${_filenameArray[1]}-${_filenameArray[2]}.json`,
        JSON.stringify(metadata, null, 2)
    );
};

const createHash = (_layers) => {
    let randNum = [];
    _layers.forEach((layer) => {
        let totalWeight = 0;
        layer.elements.forEach((element) => {
            totalWeight += 1;
        });
        // number between 0 - totalWeight
        let random = Math.floor(Math.random() * totalWeight);
        for (let i = 0; i < layer.elements.length; i++) {
            // subtract the current weight from the random weight until we reach a sub zero value.
            random -= 1;
            if (random < 0) {
                return randNum.push(`${layer.elements[i].filename}`);
            }
        }
    });
    return randNum.join(SHA_DELIMITER);
};

const isHashUnique = (_shaList = new Set(), _sha = "") => {
    return !_shaList.has(_sha);
};

/**
 * @dev generate all the images from the collection based on the configurations in the layers directory
 */
const generateImages = async () => {
    let failedCount = 0;
    let editionCount = 1;
    let abstractedIndexes = [];
    let nftFilename = "";

    for (let layerIndex = 0; layerIndex < layerConfigs.length; layerIndex++) {
        const layers = layersSetup(layerConfigs[layerIndex].layersOrder);
        while (editionCount <= layerConfigs[layerIndex].collectionSize) {
            let newHash = createHash(layers);
            if (isHashUnique(shaList, newHash)) {
                let results = mapLayerToHash(newHash, layers);
                let loadedElements = [];

                results.forEach((layer) => {
                    loadedElements.push(loadLayerImg(layer));
                });

                await Promise.all(loadedElements).then((renderObjectArray) => {
                    ctx.clearRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
                    let filenameArray = [];
                    renderObjectArray.forEach((renderObject, index) => {
                        drawElement(
                            renderObject,
                            index,
                            layerConfigs[layerIndex].layersOrder.length
                        );
                        filenameArray.push(
                            removeExtension(
                                renderObject.layer.selectedElement.filename
                            )
                        );
                    });
                    nftFilename = `${filenameArray[0]}-${filenameArray[1]}-${filenameArray[2]}`;
                    console.log(`Current Nft Name: ${nftFilename}`);
                    // Naming convention: Background-CatType-Planet
                    saveImage(nftFilename);
                    addMetadata(newHash, editionCount, filenameArray);
                    saveMetaDataSingleFile(editionCount, filenameArray);
                    console.log(
                        `Created edition: ${editionCount}, with hash: 0x${sha1(
                            newHash
                        )}`
                    );
                });
                shaList.add(newHash);
                editionCount++;
            } else {
                console.log("SHA Hash exists!");
                failedCount++;
                if (failedCount >= uniqueShaLimit) {
                    console.log(
                        `You need more layers or elements to grow your collection to ${layerConfigs[layerIndex].collectionSize} NFTs`
                    );
                    process.exit();
                }
            }
        }
    }
};

module.exports = { generateImages, buildDirs, getElements, removeExtension };
