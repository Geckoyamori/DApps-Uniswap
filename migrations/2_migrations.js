const Dai = artifacts.require("Dai");
const Link = artifacts.require("Link");
const Comp = artifacts.require("Comp");

const Dex = artifacts.require("Dex");

const toWei = (number) => web3.utils.toWei(web3.utils.toBN(number), "ether");

module.exports = async function (deployer) {
  // Deploy the contract
  // The second and subsequent arguments are set to the arguments of the ERC20 constructor
  await deployer.deploy(Dai, "Dai", "DAI", toWei(10 ** 10));
  // Get an instance of the contract deployed immediately before
  const dai = await Dai.deployed();
  await deployer.deploy(Link, "Chainlink", "LINK", toWei(10 ** 6));
  const link = await Link.deployed();
  await deployer.deploy(Comp, "Compound", "COMP", toWei(10 ** 4));
  const comp = await Comp.deployed();

  await deployer.deploy(Dex, [dai.address, link.address, comp.address]);
  const dex = await Dex.deployed();

  // Transfer eth from the person who deployed this contract to dex's contract
  await dai.transfer(dex.address, toWei(10 ** 10));
  await link.transfer(dex.address, toWei(10 ** 6));
  await comp.transfer(dex.address, toWei(10 ** 4));
};
