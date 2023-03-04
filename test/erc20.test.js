const Dai = artifacts.require("Dai");
const Link = artifacts.require("Link");
const Comp = artifacts.require("Comp");

const BN = require("bn.js");
const chai = require("chai");
const { expect } = chai;
chai.use(require("chai-bn")(BN));

const truffleAssert = require("truffle-assertions");

const toWei = (number) => web3.utils.toWei(web3.utils.toBN(number), "ether");

contract("ERC20 token test", (accounts) => {
  let dai, link, comp;

  const owner = accounts[0];
  const alice = accounts[1];
  const bob = accounts[2];

  before(async function () {
    dai = await Dai.deployed();
    link = await Link.deployed();
    comp = await Comp.deployed();
  });

  // Use chai assertion function
  describe("Basic token test", () => {
    it("Should return token names and symbols correctly", async () => {
      expect(await dai.name()).to.equal("Dai");
      expect(await link.symbol()).to.equal("LINK");
      expect(await comp.name()).to.equal("Compound");
    });
  });

  // Use chai assertion function
  describe("Supply and balance test", () => {
    it("Should have correct total supply", async () => {
      expect(await comp.totalSupply()).to.bignumber.equal(toWei(10 ** 4));
    });

    it("Should have correct initial balances", async () => {
      const ownerBalance = await comp.balanceOf(owner);
      const aliceBalance = await comp.balanceOf(alice);
      const ten_thousand = toWei(10 ** 4);
      const zero = toWei(0);
      expect(ownerBalance).to.bignumber.equal(ten_thousand);
      expect(aliceBalance).to.bignumber.equal(zero);
    });
  });

  // Use truffle assertion function
  describe("transfer() test", () => {
    it("Should revert when transfer amount > balance", async () => {
      const ownerBalance = await comp.balanceOf(owner);
      const transferAmount = await ownerBalance.add(new BN(1));
      await truffleAssert.reverts(comp.transfer(alice, transferAmount));
    });

    it("Should pass when transfer amount <= balance", async () => {
      const transferAmount = new BN(1000);
      await truffleAssert.passes(comp.transfer(alice, transferAmount));
    });

    it("Should update balances accordingly", async () => {
      const ownerBalance = await comp.balanceOf(owner);
      const aliceBalance = await comp.balanceOf(alice);
      const totalSupply = await comp.totalSupply();
      const thousand = new BN(1000);
      expect(ownerBalance).to.bignumber.equal(totalSupply.sub(thousand));
      expect(aliceBalance).to.bignumber.equal(thousand);
    });
  });

  describe("transferFrom() test", () => {
    before(async () => {
      const approveAmount = new BN(500);
      await comp.approve(bob, approveAmount, { from: alice });
    });

    it("Should revert when transfer amount > balance", async () => {
      const transferAmount = new BN(501);
      await truffleAssert.reverts(comp.transferFrom(alice, bob, transferAmount, { from: bob }));
    });

    it("Should pass when transfer amount <= balance", async () => {
      const approvedAmount = await comp.allowance(alice, bob);
      await truffleAssert.passes(comp.transferFrom(alice, bob, approvedAmount, { from: bob }));
    });
  });
});
