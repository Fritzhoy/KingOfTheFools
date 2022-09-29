const {
  loadFixture
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");
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

    await fakeEth.faucet(user1.address, 10000);
    await fakeEth.connect(user1).approve(kingOfTheFools.address, 10000);
    await fakeUsdc.faucet(user1.address, 10000);
    await fakeUsdc.connect(user1).approve(kingOfTheFools.address, 10000);
    await fool.faucet(user1.address, 10000);

    await fakeEth.faucet(user2.address, 10000);
    await fakeEth.connect(user2).approve(kingOfTheFools.address, 10000);
    await fakeUsdc.faucet(user2.address, 10000);
    await fakeUsdc.connect(user2).approve(kingOfTheFools.address, 10000);

    await fakeEth.faucet(user3.address, 10000);
    await fakeEth.connect(user3).approve(kingOfTheFools.address, 10000);


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
      fool
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
      expect(await fakeEth.balanceOf(user1.address)).to.equal(10000);
      expect(await fakeUsdc.balanceOf(user1.address)).to.equal(10000);
      expect(await fool.balanceOf(user1.address)).to.equal(10000);
    });

    it("should mint tokens to user2", async function () {
      const { fakeUsdc, fakeEth, user2, fool } = await loadFixture(
        deployKingOfTheFools
      );
      expect(await fakeEth.balanceOf(user2.address)).to.equal(10000);
      expect(await fakeUsdc.balanceOf(user2.address)).to.equal(10000);
  
    });

    it("should add ETH on the contract", async function () {
      const { kingOfTheFools, fakeEth, ETH} = await loadFixture(
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

  //** Not Happy Path */

  // it("Should set the right owner", async function () {
  //   const { kingOfTheFools, user1 } = await loadFixture(deployKingOfTheFools);
  //   expect(await kingOfTheFools.owner()).to.equal(user1.address);
  // });

  // it("should mint tokens to user1", async function () {
  //   const { fakeUsdc, fakeEth, owner } = await loadFixture(
  //     deployKingOfTheFools
  //   );
  //   expect(await fakeEth.balanceOf(owner.address)).to.equal(10000);
  //   expect(await fakeUsdc.balanceOf(owner.address)).to.equal(10000);
  // });

  // it("should mint tokens to user2", async function () {
  //   const { fakeUsdc, fakeEth, user2 } = await loadFixture(
  //     deployKingOfTheFools
  //   );
  //   expect(await fakeEth.balanceOf(user2.address)).to.equal(100);
  //   expect(await fakeUsdc.balanceOf(user2.address)).to.equal(0);
  // });

  // it("should add ETH on the contract", async function () {
  //   const { kingOfTheFools, fakeEth, USDC} = await loadFixture(
  //     deployKingOfTheFools
  //   );
  //   expect(await kingOfTheFools.tokens(USDC)).to.equal(fakeEth.address);
  // });
  
  // it("should add USDC on the contract", async function () {
  //   const { kingOfTheFools, fakeUsdc, ETH } = await loadFixture(
  //     deployKingOfTheFools
  //   );
  //   expect(await kingOfTheFools.tokens(ETH)).to.equal(fakeUsdc.address);
  // });

  describe("deposit", function () {

    it("should deposit ETH", async function () {
      const { kingOfTheFools, fakeEth, ETH, user1, user2 } = await loadFixture(deployKingOfTheFools);

      await kingOfTheFools.connect(user1).deposit(50,ETH);
      expect(await fakeEth.balanceOf(kingOfTheFools.address)).to.equal(50);
      expect(await kingOfTheFools.totalBalance()).to.equal(50);
    });
  
    it("should deposit USDC", async function () {

      const { kingOfTheFools, fakeUsdc, USDC, user1, user2 } = await loadFixture(deployKingOfTheFools);

      await kingOfTheFools.connect(user1).deposit(100,USDC);

      expect(await fakeUsdc.balanceOf(kingOfTheFools.address)).to.equal(100);
      expect(await kingOfTheFools.totalBalance()).to.equal(100);

    });

    it("should not deposit instead send token to user1", async function () {

      const { kingOfTheFools, fakeUsdc, USDC, user1, user2 } = await loadFixture(deployKingOfTheFools);

      await kingOfTheFools.connect(user1).deposit(100,USDC);
      await kingOfTheFools.connect(user2).deposit(50,USDC);

      expect(await fakeUsdc.balanceOf(kingOfTheFools.address)).to.equal(100);
      expect(await fakeUsdc.balanceOf(user1.address)).to.equal(9950);

    });

    it("should not deposit instead send token to user1", async function () {

      const { kingOfTheFools, fakeUsdc, USDC, user1, user2 } = await loadFixture(deployKingOfTheFools);

      await kingOfTheFools.connect(user1).deposit(100,USDC);
      await kingOfTheFools.connect(user2).deposit(150,USDC);

      expect(await fakeUsdc.balanceOf(kingOfTheFools.address)).to.equal(100);
      expect(await fakeUsdc.balanceOf(user1.address)).to.equal(10050);

    });

    it("should deposit USDC", async function () {

      const { kingOfTheFools, fakeUsdc, USDC, fakeEth, ETH, user1, user2, user3 } = await loadFixture(deployKingOfTheFools);

      await kingOfTheFools.connect(user1).deposit(100,USDC);
      await kingOfTheFools.connect(user2).deposit(151,USDC);
      await kingOfTheFools.connect(user3).deposit(150,ETH);

      expect(await fakeUsdc.balanceOf(kingOfTheFools.address)).to.equal(251);
      expect(await fakeEth.balanceOf(kingOfTheFools.address)).to.equal(0);
      expect(await fakeEth.balanceOf(user2.address)).to.equal(10150);

    });


    // it("should fail if token is not accepted", async function () {

    //   const { kingOfTheFools, user1, user2, fool, FOOL } = await loadFixture(deployKingOfTheFools);
    //   const notDeposit = await kingOfTheFools.connect(user1).deposit(100, FOOL);
    //   expect(await notDeposit.to.be.revertedWithCustomError(kingOfTheFools, "Token is not accepted"));
    //   // expect(await kingOfTheFools.connect(user2).deposit(100, FOOL)).revertedWithCustomError("Token is not accepted");

    // });
  });
  


});
