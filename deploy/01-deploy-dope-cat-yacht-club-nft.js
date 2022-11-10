const { network, ethers } = require("hardhat");
const {
    networkConfig,
    developmentChains,
    VRF_SUBSCRIPTION_FUND_AMOUNT,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
const {
    storeImagesWithWeb3Storage,
    storeMetadataWithWeb3Storage,
    storeTokenUris,
} = require("../utils/uploadToWeb3Storage");

let constantTokenUris = [
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-jaguar-earth.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-jaguar-jupiter.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-jaguar-mars.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-jaguar-mercury.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-jaguar-neptune.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-jaguar-saturn.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-jaguar-theMoon.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-jaguar-theSun.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-jaguar-uranus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-jaguar-venus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-lion-earth.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-lion-jupiter.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-lion-mars.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-lion-mercury.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-lion-neptune.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-lion-saturn.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-lion-theMoon.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-lion-theSun.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-lion-uranus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-lion-venus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-puma-earth.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-puma-jupiter.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-puma-mars.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-puma-mercury.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-puma-neptune.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-puma-saturn.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-puma-theMoon.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-puma-theSun.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-puma-uranus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-puma-venus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-tiger-earth.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-tiger-jupiter.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-tiger-mars.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-tiger-mercury.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-tiger-neptune.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-tiger-saturn.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-tiger-theMoon.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-tiger-theSun.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-tiger-uranus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-tiger-venus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-whiteTiger-earth.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-whiteTiger-jupiter.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-whiteTiger-mars.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-whiteTiger-mercury.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-whiteTiger-neptune.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-whiteTiger-saturn.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-whiteTiger-theMoon.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-whiteTiger-theSun.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-whiteTiger-uranus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/desert-whiteTiger-venus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-jaguar-earth.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-jaguar-jupiter.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-jaguar-mars.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-jaguar-mercury.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-jaguar-neptune.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-jaguar-saturn.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-jaguar-theMoon.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-jaguar-theSun.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-jaguar-uranus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-jaguar-venus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-lion-earth.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-lion-jupiter.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-lion-mars.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-lion-mercury.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-lion-neptune.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-lion-saturn.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-lion-theMoon.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-lion-theSun.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-lion-uranus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-lion-venus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-puma-earth.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-puma-jupiter.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-puma-mars.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-puma-mercury.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-puma-neptune.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-puma-saturn.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-puma-theMoon.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-puma-theSun.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-puma-uranus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-puma-venus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-tiger-earth.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-tiger-jupiter.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-tiger-mars.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-tiger-mercury.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-tiger-neptune.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-tiger-saturn.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-tiger-theMoon.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-tiger-theSun.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-tiger-uranus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-tiger-venus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-whiteTiger-earth.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-whiteTiger-jupiter.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-whiteTiger-mars.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-whiteTiger-mercury.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-whiteTiger-neptune.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-whiteTiger-saturn.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-whiteTiger-theMoon.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-whiteTiger-theSun.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-whiteTiger-uranus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/ice-whiteTiger-venus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-jaguar-earth.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-jaguar-jupiter.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-jaguar-mars.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-jaguar-mercury.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-jaguar-neptune.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-jaguar-saturn.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-jaguar-theMoon.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-jaguar-theSun.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-jaguar-uranus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-jaguar-venus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-lion-earth.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-lion-jupiter.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-lion-mars.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-lion-mercury.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-lion-neptune.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-lion-saturn.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-lion-theMoon.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-lion-theSun.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-lion-uranus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-lion-venus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-puma-earth.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-puma-jupiter.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-puma-mars.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-puma-mercury.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-puma-neptune.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-puma-saturn.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-puma-theMoon.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-puma-theSun.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-puma-uranus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-puma-venus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-tiger-earth.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-tiger-jupiter.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-tiger-mars.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-tiger-mercury.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-tiger-neptune.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-tiger-saturn.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-tiger-theMoon.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-tiger-theSun.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-tiger-uranus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-tiger-venus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-whiteTiger-earth.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-whiteTiger-jupiter.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-whiteTiger-mars.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-whiteTiger-mercury.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-whiteTiger-neptune.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-whiteTiger-saturn.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-whiteTiger-theMoon.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-whiteTiger-theSun.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-whiteTiger-uranus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/jungle-whiteTiger-venus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-jaguar-earth.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-jaguar-jupiter.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-jaguar-mars.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-jaguar-mercury.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-jaguar-neptune.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-jaguar-saturn.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-jaguar-theMoon.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-jaguar-theSun.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-jaguar-uranus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-jaguar-venus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-lion-earth.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-lion-jupiter.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-lion-mars.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-lion-mercury.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-lion-neptune.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-lion-saturn.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-lion-theMoon.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-lion-theSun.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-lion-uranus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-lion-venus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-puma-earth.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-puma-jupiter.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-puma-mars.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-puma-mercury.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-puma-neptune.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-puma-saturn.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-puma-theMoon.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-puma-theSun.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-puma-uranus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-puma-venus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-tiger-earth.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-tiger-jupiter.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-tiger-mars.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-tiger-mercury.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-tiger-neptune.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-tiger-saturn.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-tiger-theMoon.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-tiger-theSun.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-tiger-uranus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-tiger-venus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-whiteTiger-earth.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-whiteTiger-jupiter.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-whiteTiger-mars.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-whiteTiger-mercury.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-whiteTiger-neptune.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-whiteTiger-saturn.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-whiteTiger-theMoon.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-whiteTiger-theSun.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-whiteTiger-uranus.json",
    "ipfs://bafybeibbanyrzp7rfrvimwfx7hlxdljn2kehd5te3ve2um4ojq53vlh62u/savannah-whiteTiger-venus.json",
];

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    let vrfCoordinatorV2Mock,
        vrfCoordinatorV2Address,
        subscriptionId,
        tokenUris;

    console.log("----------------------------------");
    if (developmentChains.includes(network.name)) {
        console.log(`Deploying Mocks from local network: ${network.name}`);
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");

        vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
        const transactionResponse =
            await vrfCoordinatorV2Mock.createSubscription();
        const transactionReceipt = await transactionResponse.wait();
        subscriptionId = transactionReceipt.events[0].args.subId;
        await vrfCoordinatorV2Mock.fundSubscription(
            subscriptionId,
            VRF_SUBSCRIPTION_FUND_AMOUNT
        );

        tokenUris = constantTokenUris;
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"];
        subscriptionId = networkConfig[chainId]["subscriptionId"];
        tokenUris = await handleTokenUris();
    }

    const mintFee = networkConfig[chainId]["mintFee"];
    const gasLane = networkConfig[chainId]["gasLane"];
    const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"];
    const interval = networkConfig[chainId]["interval"];

    const args = [
        vrfCoordinatorV2Address,
        subscriptionId,
        gasLane,
        callbackGasLimit,
        interval,
        mintFee,
        tokenUris,
    ];

    const dopeCatYachtClubNft = await deploy("DopeCatYachtClubNft", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    if (developmentChains.includes(network.name)) {
        console.log(
            "Adding dopeCatYachtClub as consumer to VRFCordinatorV2Mock"
        );
        /* add consumer */
        try {
            await vrfCoordinatorV2Mock.addConsumer(
                subscriptionId.toNumber(),
                dopeCatYachtClubNft.address
            );
        } catch (error) {
            console.log(`ERROR: ${error}`);
        }
    }

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        console.log("Verifying Contract...");
        await verify(dopeCatYachtClubNft.address, args);
    }
    console.log("----------------------------------");
};

const handleTokenUris = async () => {
    const basePath = process.cwd();
    const imagePath = `${basePath}/build/images`;
    const metadataPath = `${basePath}/build/metadata`;

    //Store image on IPFS
    const imageCid = await storeImagesWithWeb3Storage(imagePath);

    //Store metdata on IPFS
    const metadataCid = await storeMetadataWithWeb3Storage(
        metadataPath,
        imageCid
    );

    const tokenUris = storeTokenUris(metadataPath, metadataCid);

    return tokenUris;
};

module.exports.tags = ["all", "dopeCatYachtClubNft"];
