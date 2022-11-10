const removeExtension = (_filename) => {
    return _filename.replace(/\.[^/.]+$/, "");
};

const addExtension = (_filename, _extension) => {
    return _filename.concat(_extension);
};

const replaceExtension = (_filename, _newExtension) => {
    const file = removeExtension(_filename);
    return addExtension(file, _newExtension);
};

module.exports = { removeExtension, addExtension, replaceExtension };
