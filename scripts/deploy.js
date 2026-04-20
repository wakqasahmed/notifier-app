const { ethers } = require("hardhat");

async function main() {
    // Deploy NotifierMultiFormatter
    const Notifier = await ethers.getContractFactory("NotifierMultiFormatter");
    const notifier = await Notifier.deploy();
    await notifier.waitForDeployment();
    const notifierAddress = await notifier.getAddress();
    console.log("NotifierMultiFormatter deployed to:", notifierAddress);

    // Set initial formatter URIs
    const directFormatterURI = "https://ipfs.io/ipfs/bafkreihesmdzo7hxbottmzfsdre7hp5smqf5bmd7aa4qda43tay2njx2wi";
    const broadcastFormatterURI = "https://ipfs.io/ipfs/bafkreicbd3cprufiemcmwap2toed4ga6lq2zg3iwhvaarmx66jyyyxnyae";

    let tx = await notifier.setDirectFormatterURI(directFormatterURI);
    await tx.wait();
    console.log("Direct formatter URI set");

    tx = await notifier.setBroadcastFormatterURI(broadcastFormatterURI);
    await tx.wait();
    console.log("Broadcast formatter URI set");

    // Deploy UseCasesDemo with notifier address
    const UseCases = await ethers.getContractFactory("UseCasesDemo");
    const useCases = await UseCases.deploy(notifierAddress);
    await useCases.waitForDeployment();
    const useCasesAddress = await useCases.getAddress();
    console.log("UseCasesDemo deployed to:", useCasesAddress);

    console.log("\n--- Update your .env file with these values ---");
    console.log(`REACT_APP_NOTIFIER_ADDRESS=${notifierAddress}`);
    console.log(`REACT_APP_USECASES_ADDRESS=${useCasesAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
