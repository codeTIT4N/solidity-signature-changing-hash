import hre from "hardhat";

async function main() {
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const contract = await MyToken.deploy();
  await contract.deployTransaction.wait(6); //wait for 6 confimations

  await contract.deployed();
  console.log(`MyToken deployed to: ${contract.address}`);

  // verify contract
  await hre.run("verify:verify", {
    address: contract.address,
    constructorArguments: [],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
