const { ethers } = require("hardhat");

const networkConfig = {
    31337: {
        name: "hardhat",
        mintFee: ethers.utils.parseEther("0.0001"),
        gasLane:
            "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        callbackGasLimit: "500000",
        interval: "30",
    },
    5: {
        name: "goerli",
        // btcEthPriceFeed: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
        btcUsdPriceFeed: "0xA39434A63A52E749F02807ae27335515BA4b07F7",
        daiUsdPriceFeed: "0x0d79df66BE487753B02D015Fb622DED7f0E9798d",
        ethUsdPriceFeed: "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e",
        // forthUsdPriceFeed: "0x7A65Cf6C2ACE993f09231EC1Ea7363fb29C13f2F",
        // linkEthPriceFeed: "0xb4c4a493AB6356497713A78FFA6c60FB53517c63",
        // linkUsdPriceFeed: "0x48731cF7e84dc94C5f84577882c14Be11a5B7456",
        usdcUsdPriceFeed: "0xAb5c49580294Aff77670F839ea425f5b78ab3Ae7",
        vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        mintFee: ethers.utils.parseEther("0.0001"), //0.0001 ETH
        gasLane:
            "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        subscriptionId: "1515",
        callbackGasLimit: "500000",
        interval: "30",
    },
    80001: {
        name: "mumbai",
        btcUsdPriceFeed: "0x007A22900a3B98143368Bd5906f8E17e9867581b",
        daiUsdPriceFeed: "0x0FCAa9c899EC5A91eBc3D5Dd869De833b06fB046",
        ethUsdPriceFeed: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
        // eurUsdPriceFeed: "0x7d7356bF6Ee5CDeC22B216581E48eCC700D0497A",
        // linkMaticPriceFeed: "0x12162c3E810393dEC01362aBf156D7ecf6159528",
        // maticUsdPriceFeed: "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
        // sandUsdPriceFeed: "0x9dd18534b8f456557d11B9DDB14dA89b2e52e308",
        // maticUsdPriceFeed: "0xd0D5e3DB44DE05E9F294BB0a3bEEaF030DE24Ada",
        usdcUsdPriceFeed: "0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0",
    },
    402: {
        name: "optimismGoerli",
        btcUsdPriceFeed: "0xC16679B963CeB52089aD2d95312A5b85E318e9d2",
        daiUsdPriceFeed: "0x31856c9a2A73aAee6100Aed852650f75c5F539D0",
        ethUsdPriceFeed: "0x57241A37733983F97C4Ab06448F244A1E0Ca0ba8",
        // linkEthPriceFeed: "0x37410D317b96E1fED1814473E1CcD323D0eB4Eb1",
        // linkUsdPriceFeed: "0x69C5297001f38cCBE30a81359da06E5256bd28B9",
        usdcUsdPriceFeed: "0x2636B223652d388721A0ED2861792DA9062D8C73",
    },
};

developmentChains = ["hardhat", "localhost"];

const VRF_SUBSCRIPTION_FUND_AMOUNT = ethers.utils.parseEther("30");
const MOCK_BASE_FEE = ethers.utils.parseEther("0.25");
const MOCK_GAS_PRICE_LINK = 1e9; // Calculated value: link/gas

module.exports = {
    networkConfig,
    developmentChains,
    VRF_SUBSCRIPTION_FUND_AMOUNT,
    MOCK_BASE_FEE,
    MOCK_GAS_PRICE_LINK,
};
