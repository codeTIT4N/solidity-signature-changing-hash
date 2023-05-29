import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers, network } from "hardhat";

describe("SignatureChangingHash contract tests", function () {
  function toBN(_num: number) {
    return ethers.BigNumber.from(_num.toString());
  }
  function parseEth(_num: number) {
    return ethers.utils.parseEther(_num.toString());
  }
  function formatEth(_num: number) {
    return ethers.utils.formatEther(_num.toString());
  }

  async function deployContract() {
    // Contracts are deployed using the first signer/account by default
    const [owner, A, B, C, D, E] = await ethers.getSigners();

    const SignatureChangingHash = await ethers.getContractFactory(
      "SignatureChangingHash"
    );
    const contract = await SignatureChangingHash.deploy();

    return {
      contract,
      owner,
      A,
      B,
      C,
      D,
      E,
    };
  }

  describe("Deployment", function () {
    it("Should deploy the contract properly", async function () {
      const { contract } = await loadFixture(deployContract);
      expect(contract.address).to.not.equal(ethers.constants.AddressZero);
    });
    it("Should set the right signer", async function () {
      const { contract, owner } = await loadFixture(deployContract);
      expect(await contract.signerAddress()).to.equal(owner.address);
    });
    it("referenceTimestamp should be set to deploy timestamp", async function () {
      const { contract } = await loadFixture(deployContract);
      const blockNumber = contract.deployTransaction.blockNumber;
      const block = await ethers.provider.getBlock(blockNumber!);
      expect(await contract.referenceTimestamp()).to.equal(block.timestamp);
    });
    it("nonce should be set to 0", async function () {
      const { contract } = await loadFixture(deployContract);
      expect(await contract.nonce()).to.equal(0);
    });
    it("chainId should be set to the correct chain Id", async function () {
      const { contract } = await loadFixture(deployContract);
      expect(await contract.chainId()).to.equal(network.config.chainId);
    });
  });
  describe("Functionality tests", function () {
    it("getHashTimestamp(): Should return the same value as the reference timestamp in the beginning", async function () {
      const { contract } = await loadFixture(deployContract);
      expect(await contract.getHashTimestamp()).to.equal(
        await contract.referenceTimestamp()
      );
    });
    it("getHashTimestamp(): Value should not change before 2 minutes", async function () {
      const { contract } = await loadFixture(deployContract);
      // increase time by 1 minute
      await network.provider.send("evm_increaseTime", [60]);
      await network.provider.send("evm_mine");
      expect(await contract.getHashTimestamp()).to.equal(
        await contract.referenceTimestamp()
      );
      // increase time by 59 seconds
      await network.provider.send("evm_increaseTime", [59]);
      await network.provider.send("evm_mine");
      expect(await contract.getHashTimestamp()).to.equal(
        await contract.referenceTimestamp()
      );
    });
    it("getHashTimestamp(): Value should increase after every 2 minutes", async function () {
      const { contract } = await loadFixture(deployContract);
      // increase time by 2 minutes
      await network.provider.send("evm_increaseTime", [120]);
      await network.provider.send("evm_mine");
      expect(await contract.getHashTimestamp()).to.not.equal(
        await contract.referenceTimestamp()
      );
      expect(await contract.getHashTimestamp()).to.above(
        await contract.referenceTimestamp()
      );
      // again increase time by 2 minutes
      await network.provider.send("evm_increaseTime", [120]);
      await network.provider.send("evm_mine");
      expect(await contract.getHashTimestamp()).to.not.equal(
        await contract.referenceTimestamp()
      );
      expect(await contract.getHashTimestamp()).to.above(
        await contract.referenceTimestamp()
      );
    });
    it("getHash(): Should create correct hash according to values from constructor", async function () {
      const { contract } = await loadFixture(deployContract);
      const hash = await contract.getHash();
      const hash2 = ethers.utils.solidityKeccak256(
        ["address", "uint256", "uint256", "uint256"],
        [
          contract.address,
          await contract.chainId(),
          await contract.nonce(),
          await contract.referenceTimestamp(),
        ]
      );
      expect(hash).to.equal(hash2);
    });
    it("getHash(): Hash should not change before 2 minutes", async function () {
      const { contract } = await loadFixture(deployContract);
      const hash = await contract.getHash();
      // increase time by 1 minutes
      await network.provider.send("evm_increaseTime", [60]);
      await network.provider.send("evm_mine");
      const hash2 = await contract.getHash();
      expect(hash).to.equal(hash2);
      // increase time by 59 seconds
      await network.provider.send("evm_increaseTime", [59]);
      await network.provider.send("evm_mine");
      const hash3 = await contract.getHash();
      expect(hash).to.equal(hash3);
    });
    it("getHash(): Hash should change after 2 minutes", async function () {
      const { contract } = await loadFixture(deployContract);
      const hash = await contract.getHash();
      // increase time by 2 minutes
      await network.provider.send("evm_increaseTime", [120]);
      await network.provider.send("evm_mine");
      const hash2 = await contract.getHash();
      expect(hash).to.not.equal(hash2);
    });
  });
});
