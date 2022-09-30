const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { assert, expect} = require("chai");
const { ethers } = require("hardhat");

describe("KingOfTheFools", function () {
  //fixtures useful for test the contract
  async function deployKingOfTheFools() {
    // Getting accounts
    const [owner, user1, user2, user3] = await ethers.getSigners();

    const KingOfTheFools = await ethers.getContractFactory("KingOfTheFools");
    const FakeEth = await ethers.getContractFactory("FakeEth");
    const FakeUsdc = await ethers.getContractFactory("FakeUsdc");
    const Fool = await ethers.getContractFactory("Fool");
    const kingOfTheFools = await KingOfTheFools.deploy();
    const fakeEth = await FakeEth.deploy();
    const fakeUsdc = await FakeUsdc.deploy();
    const fool = await Fool.deploy();

    await fakeEth.faucet(user1.address, 1000);
    await fakeEth.connect(user1).approve(kingOfTheFools.address, 1000);
    await fakeUsdc.faucet(user1.address, 1000);
    await fakeUsdc.connect(user1).approve(kingOfTheFools.address, 1000);
    await fool.faucet(user1.address, 1000);

    await fakeEth.faucet(user2.address, 1000);
    await fakeEth.connect(user2).approve(kingOfTheFools.address, 1000);
    await fakeUsdc.faucet(user2.address, 1000);
    await fakeUsdc.connect(user2).approve(kingOfTheFools.address, 1000);

    await fakeEth.faucet(user3.address, 1000);
    await fakeEth.connect(user3).approve(kingOfTheFools.address, 1000);

    let ETH = ethers.utils.formatBytes32String("Eth");
    let USDC = ethers.utils.formatBytes32String("Usdc");
    let FOOL = ethers.utils.formatBytes32String("Fool");

    await kingOfTheFools.addToken(ETH, fakeEth.address);
    await kingOfTheFools.addToken(USDC, fakeUsdc.address);

    return {
      kingOfTheFools,
      fakeEth,
      fakeUsdc,
      owner,
      user1,
      user2,
      user3,
      ETH,
      USDC,
      FOOL,
      fool,
    };
  }

  describe("Deployment", function () {
    //**Happy Path */
    it("Should set the right owner", async function () {
      const { kingOfTheFools, owner } = await loadFixture(deployKingOfTheFools);
      expect(await kingOfTheFools.owner()).to.equal(owner.address);
    });

    it("should mint tokens to user1", async function () {
      const { fakeUsdc, fakeEth, user1, fool } = await loadFixture(
        deployKingOfTheFools
      );
      expect(await fakeEth.balanceOf(user1.address)).to.equal(1000);
      expect(await fakeUsdc.balanceOf(user1.address)).to.equal(1000);
      expect(await fool.balanceOf(user1.address)).to.equal(1000);
    });

    it("should mint tokens to user2", async function () {
      const { fakeUsdc, fakeEth, user2, fool } = await loadFixture(
        deployKingOfTheFools
      );
      expect(await fakeEth.balanceOf(user2.address)).to.equal(1000);
      expect(await fakeUsdc.balanceOf(user2.address)).to.equal(1000);
    });

    it("should add ETH on the contract", async function () {
      const { kingOfTheFools, fakeEth, ETH } = await loadFixture(
        deployKingOfTheFools
      );
      expect(await kingOfTheFools.tokens(ETH)).to.equal(fakeEth.address);
    });

    it("should add USDC on the contract", async function () {
      const { kingOfTheFools, fakeUsdc, USDC } = await loadFixture(
        deployKingOfTheFools
      );
      expect(await kingOfTheFools.tokens(USDC)).to.equal(fakeUsdc.address);
    });
  });
  describe("deposit", function () {
    it("should deposit ETH", async function () {
      const { kingOfTheFools, fakeEth, ETH, user1, user2 } = await loadFixture(
        deployKingOfTheFools
      );

      await kingOfTheFools.connect(user1).deposit(50, ETH);
      expect(await fakeEth.balanceOf(kingOfTheFools.address)).to.equal(50);
      expect(await kingOfTheFools.totalBalance()).to.equal(50);
    });

    it("should deposit USDC", async function () {
      const { kingOfTheFools, fakeUsdc, USDC, user1 } =
        await loadFixture(deployKingOfTheFools);

      await kingOfTheFools.connect(user1).deposit(100, USDC);

      expect(await fakeUsdc.balanceOf(kingOfTheFools.address)).to.equal(100);
      expect(await kingOfTheFools.totalBalance()).to.equal(100);
    });

    it("should emit event NewDeposit", async function () {
      const { kingOfTheFools, fakeUsdc, USDC, user1 } =
        await loadFixture(deployKingOfTheFools);

      expect(await kingOfTheFools.connect(user1).deposit(100, USDC)).to.emit(kingOfTheFools.address, "NewDeposit");
     
    });

    it("should emit event NewKingOfTheFools", async function () {
      const { kingOfTheFools, fakeUsdc, USDC, user1, user2 } =
        await loadFixture(deployKingOfTheFools);

      await kingOfTheFools.connect(user1).deposit(100, USDC);
      expect(await kingOfTheFools.connect(user1).deposit(50, USDC)).to.emit(kingOfTheFools.address, "NewKingOfTheFools");
      
    });

    it("should deposit USDC to user1 and user1 should withdraw it", async function () {
      const { kingOfTheFools, fakeUsdc, USDC, user1, user2 } =
        await loadFixture(deployKingOfTheFools);

      await kingOfTheFools.connect(user1).deposit(100, USDC);
      await kingOfTheFools.connect(user2).deposit(150, USDC);
      await kingOfTheFools.connect(user1).withdrawReward();

      expect(await fakeUsdc.balanceOf(kingOfTheFools.address)).to.equal(100);
      expect(await fakeUsdc.balanceOf(user1.address)).to.equal(1050);
    });

    it("should deposit ETH to user2", async function () {
      const {
        kingOfTheFools,
        fakeUsdc,
        USDC,
        fakeEth,
        ETH,
        user1,
        user2,
        user3,
      } = await loadFixture(deployKingOfTheFools);

      await kingOfTheFools.connect(user1).deposit(100, USDC);
      await kingOfTheFools.connect(user2).deposit(151, USDC);
      await kingOfTheFools.connect(user3).deposit(150, ETH);
      await kingOfTheFools.connect(user2).withdrawReward();

      expect(await fakeUsdc.balanceOf(kingOfTheFools.address)).to.equal(251);
      expect(await fakeEth.balanceOf(kingOfTheFools.address)).to.equal(0);
      expect(await fakeEth.balanceOf(user2.address)).to.equal(1150);
    });
  });

  //** Not Happy Path */
  describe("Deployment Not Happy Path", function () {
    it("Should set the right owner", async function () {
      const { kingOfTheFools, user1 } = await loadFixture(deployKingOfTheFools);
      expect(await kingOfTheFools.owner()).to.not.equal(user1.address);
    });

    it("should mint tokens to user1", async function () {
      const { fakeUsdc, fakeEth, owner } = await loadFixture(
        deployKingOfTheFools
      );
      expect(await fakeEth.balanceOf(owner.address)).to.not.equal(1030);
      expect(await fakeUsdc.balanceOf(owner.address)).to.not.equal(1200);
    });

    it("should mint tokens to user2", async function () {
      const { fakeUsdc, fakeEth, user2 } = await loadFixture(
        deployKingOfTheFools
      );
      expect(await fakeEth.balanceOf(user2.address)).to.not.equal(100);
      expect(await fakeUsdc.balanceOf(user2.address)).to.not.equal(0);
    });

    it("should add ETH on the contract", async function () {
      const { kingOfTheFools, fakeEth, USDC } = await loadFixture(
        deployKingOfTheFools
      );
      expect(await kingOfTheFools.tokens(USDC)).to.not.equal(fakeEth.address);
    });

    it("should add USDC on the contract", async function () {
      const { kingOfTheFools, fakeUsdc, ETH } = await loadFixture(
        deployKingOfTheFools
      );
      expect(await kingOfTheFools.tokens(ETH)).to.not.equal(fakeUsdc.address);
    });
  });

  describe("Not Happy Path Deposit", function(){

    it("should revert if token is not accepted", async function () {

      const { kingOfTheFools, user1, user2, fool, FOOL } = await loadFixture(deployKingOfTheFools);
      await expect(kingOfTheFools.connect(user1).deposit(1100,FOOL)).to.be.reverted;
      
    });

    it("should revert if user haven't enough tokens", async function () {

      const { kingOfTheFools, user1, ETH, fakeEth } = await loadFixture(deployKingOfTheFools);
      await expect(kingOfTheFools.connect(user1).deposit(1100,ETH)).to.be.reverted;
      
    });

    it("should revert if user send zero tokens", async function () {

      const { kingOfTheFools, user1, ETH, fakeEth } = await loadFixture(deployKingOfTheFools);
      await expect(kingOfTheFools.connect(user1).deposit(0,ETH)).to.be.revertedWith("should send more than zero tokens");
      
    });

    it("should not allow user2 to withdrawReward", async function () {
      const { kingOfTheFools, fakeEth, ETH, user1, user2 } = await loadFixture(
        deployKingOfTheFools
      );

        await kingOfTheFools.connect(user1).deposit(10, ETH);
        await kingOfTheFools.connect(user2).deposit(15, ETH);
        await expect(kingOfTheFools.connect(user2).withdrawReward()).to.be.revertedWith("No rewards to this address");
    });

    it("should not allow user1 to withdrawReward", async function () {
      const { kingOfTheFools, fakeEth, ETH, user1 } = await loadFixture(
        deployKingOfTheFools
      );
      await kingOfTheFools.connect(user1).deposit(10, ETH);
      await expect(kingOfTheFools.connect(user1).withdrawReward()).to.be.revertedWith("No rewards to this address");
    
    });

     it("should not allow user2 to withdrawReward", async function () {
      const { kingOfTheFools, fakeEth, ETH, user2 } = await loadFixture(
        deployKingOfTheFools
      );
      await expect(kingOfTheFools.connect(user2).withdrawReward()).to.be.revertedWith("No rewards to this address");
  
    });

    it("should not allow user1 to withdrawReward", async function () {
      const { kingOfTheFools, fakeEth, ETH, user2, user1, USDC } = await loadFixture(
        deployKingOfTheFools
      );
        await kingOfTheFools.connect(user1).deposit(10, ETH);
        await kingOfTheFools.connect(user2).deposit(16, USDC);
        await expect(kingOfTheFools.connect(user1).withdrawReward()).to.be.revertedWith("No rewards to this address");
  
      });
    
    });

  });
