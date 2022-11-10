const { Web3Storage, getFilesFromPath, File } = require("web3.storage");
const { storeFiles } = require("./web3StorageClient");
const { replaceExtension } = require("./extension");
const fs = require("fs-extra");
require("dotenv").config();

const storeImagesWithWeb3Storage = async (imagesPath) => {
    if (!fs.existsSync(imagesPath)) {
        return null;
    }
    const files = fs.readdirSync(imagesPath);
    let responses = [];
    console.log(`Uploading Images to Web3 Storage: ${imagesPath}`);
    let imageFiles = [];
    files.forEach((file) => {
        const reader = fs.readFileSync(`${imagesPath}/${file}`);
        imageFiles.push(new File([reader], `${file}`));
    });
    const cid = await storeFiles(imageFiles);
    return cid;
};

const storeMetadataWithWeb3Storage = async (metadataPath, imageCid) => {
    if (!fs.existsSync(metadataPath)) {
        return null;
    }
    const files = fs.readdirSync(metadataPath);
    let metadataFiles = [];
    console.log(`Uploading Metadata to Web3 storage: ${metadataPath}`);
    files.forEach((file) => {
        const buffer = fs.readFileSync(`${metadataPath}/${file}`);
        const stringJson = JSON.parse(buffer);

        stringJson.image = `ipfs://${imageCid}/${replaceExtension(
            file,
            ".png"
        )}`;
        metadataFiles.push(new File([JSON.stringify(stringJson)], `${file}`));
    });
    const cid = await storeFiles(metadataFiles);
    return cid;
};

const storeTokenUris = (metadataPath, cid) => {
    let tokenUris = [];
    if (!fs.existsSync(metadataPath)) {
        return null;
    }
    const files = fs.readdirSync(metadataPath);
    files.forEach((file) => {
        tokenUris.push(`ipfs://${cid}/${file}`);
    });
    return tokenUris;
};

module.exports = {
    storeImagesWithWeb3Storage,
    storeMetadataWithWeb3Storage,
    storeTokenUris,
};
