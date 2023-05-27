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
  describe("Contract tests", function () {}); // @todo
});
