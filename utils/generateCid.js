const { File } = require("web3.storage");
const { storeFiles, makeStorageClient } = require("./web3StorageClient");
const fs = require("fs-extra");
require("dotenv").config();

const generateCid = async () => {
    const initNftObj = {
        collection: "Dope Cat Yacht Club Nft Collection",
        size: 200,
    };
    const buffer = new Buffer.from(JSON.stringify(initNftObj));

    const files = [new File([buffer], "collectionDescription.json")];

    const cid = await storeFiles(files);

    return cid;
};

const retrieveCid = async (cid) => {
    const client = makeStorageClient();
    const res = await client.get(cid);
    if (!res.ok) {
        throw new Error(`failed to get ${cid}`);
    }
    return res;
};

module.exports = { generateCid, retrieveCid };
