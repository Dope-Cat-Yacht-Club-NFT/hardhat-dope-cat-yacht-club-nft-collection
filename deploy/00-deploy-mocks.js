const { network, ethers } = require("hardhat");
const {
    networkConfig,
    developmentChains,
    MOCK_BASE_FEE,
    MOCK_GAS_PRICE_LINK,
} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    if (developmentChains.includes(network.name)) {
        console.log(`Deploying Mocks from local network: ${network.name}`);
        const args = [MOCK_BASE_FEE, MOCK_GAS_PRICE_LINK];

        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            args: args,
            log: true,
        });

        console.log("Mocks deployed");
        console.log(
            "Run npx hardhat console --network localhost to interact with deployed smartcontracts"
        );
    }
};

module.exports.tags = ["all", "mocks"];
