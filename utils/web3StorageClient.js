const { Web3Storage, getFilesFromPath } = require("web3.storage");

const storeFiles = async (files) => {
    // show the root cid as soon as it's ready
    const onRootCidReady = (cid) => {
        console.log("uploading files with cid:", cid);
    };

    // when each chunk is stored, update the percentage complete and display
    const totalSize = files.map((f) => f.size).reduce((a, b) => a + b, 0);
    let uploaded = 0;

    const onStoredChunk = (size) => {
        uploaded += size;
        const pct = 100 * (uploaded / totalSize);
        console.log(`Uploading... ${pct.toFixed(2)}% complete`);
    };

    // Make a storage client
    const client = makeStorageClient();

    // client.put will invoke our callbacks during the upload
    // and return the root cid when the upload completes
    return client.put(files, { onRootCidReady, onStoredChunk });
};

const getAccessToken = () => {
    return process.env.WEB3STORAGE_TOKEN;
};

const makeStorageClient = () => {
    return new Web3Storage({ token: getAccessToken() });
};

module.exports = { storeFiles, makeStorageClient };
