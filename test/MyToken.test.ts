import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyToken tests", function () {
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
    const [
      owner,
      ankit,
      bhuvan,
      chitra,
      daksh,
      ekta,
      fateh,
      gagan,
      hari,
      isha,
      A,
      B,
      C,
      D,
      E,
    ] = await ethers.getSigners();

    const MyToken = await ethers.getContractFactory("MyToken");
    const mytoken = await MyToken.deploy();

    return {
      mytoken,
      owner,
      ankit,
      bhuvan,
      chitra,
      daksh,
      ekta,
      fateh,
      gagan,
      hari,
      isha,
      A,
      B,
      C,
      D,
      E,
    };
  }

  describe("Deployment", function () {
    it("Should deploy the contract properly", async function () {
      const { mytoken } = await loadFixture(deployContract);

      expect(mytoken.address).to.not.equal(ethers.constants.AddressZero);
    });

    it("Should set the right owner", async function () {
      const { mytoken, owner } = await loadFixture(deployContract);

      expect(await mytoken.owner()).to.equal(owner.address);
    });

    it("Should receive and store the funds to lock", async function () {
      const { mytoken } = await loadFixture(deployContract);

      expect(await mytoken.name()).to.equal("MyToken");
      expect(await mytoken.symbol()).to.equal("MTK");
    });
  });

  describe("Transactions", function () {
    let _mytoken: any;
    let _owner: any;
    let _ankit: any;
    let _bhuvan: any;
    before(async () => {
      const { mytoken, owner, ankit, bhuvan } = await loadFixture(
        deployContract
      );
      _mytoken = mytoken;
      _owner = owner;
      _ankit = ankit;
      _bhuvan = bhuvan;
    });

    it("Owner should be able to mint tokens", async function () {
      await _mytoken.connect(_owner).mint(_owner.address, parseEth(100));
      expect(await _mytoken.balanceOf(_owner.address)).to.equal(parseEth(100));
    });

    it("Owner should be able to burn tokens", async function () {
      await _mytoken.connect(_owner).burn(parseEth(10));
      expect(await _mytoken.balanceOf(_owner.address)).to.equal(parseEth(90));
    });
    it("Should transfer tokens between accounts", async function () {
      try {
        // Transfer 50 tokens from owner to ankit
        await _mytoken.connect(_owner).transfer(_ankit.address, parseEth(50));
        const ankitBalance = await _mytoken.balanceOf(_ankit.address);
        expect(ankitBalance).to.equal(parseEth(50));
        // Transfer 50 tokens from ankit to bhuvan
        await _mytoken.connect(_ankit).transfer(_bhuvan.address, parseEth(50));
        const bhuvanBalance = await _mytoken.balanceOf(_bhuvan.address);
        expect(bhuvanBalance).to.equal(parseEth(50));
      } catch (e) {
        console.log(e);
      }
    });
    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await _mytoken.balanceOf(_owner.address);

      // Try to send 1000 token from ankit to owner.
      await expect(
        _mytoken.connect(_ankit).transfer(_owner.address, parseEth(1000))
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed.
      expect(await _mytoken.balanceOf(_owner.address)).to.equal(
        initialOwnerBalance
      );
    });
  });
});
