import hre from "hardhat";

async function main() {
  const SignatureChangingHash = await hre.ethers.getContractFactory(
    "SignatureChangingHash"
  );
  const contract = await SignatureChangingHash.deploy();
  await contract.deployTransaction.wait(6); //wait for 6 confimations

  await contract.deployed();
  console.log(
    `SignatureChangingHash contract deployed to: ${contract.address}`
  );

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
