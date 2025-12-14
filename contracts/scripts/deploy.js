const hre = require("hardhat");

async function main() {
    console.log("Deploying SusuChainVault contract...");

    // We get the contract to deploy
    // Note: SusuVault contract will be created in the next step
    // This script assumes the contract name is "SusuChainVault"
    const SusuVault = await hre.ethers.getContractFactory("SusuChainVault");
    const susuVault = await SusuVault.deploy();

    await susuVault.waitForDeployment();

    console.log("SusuChainVault deployed to:", await susuVault.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
