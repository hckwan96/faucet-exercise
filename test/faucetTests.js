const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');
const { ethers } = require("hardhat");

describe('Faucet Test', function () {
  async function deployContractAndSetVariables() {
    // const Faucet = await hre.ethers.getContractFactory('Faucet');
    // const faucet = await Faucet.deploy({ value: ethers.parseEther("1") });

    // const [owner] = await hre.ethers.getSigners();

    const amount = ethers.parseUnits("1", "ether");
    const provider = ethers.provider;
    const Faucet = await ethers.getContractFactory('Faucet');
    const faucet = await Faucet.deploy({ value: amount });
    const [owner, notOwner] = await ethers.getSigners();

    return { faucet, provider, owner, notOwner, amount };
  }

  it('should deploy and set the owner correctly', async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

    expect(await faucet.owner()).to.equal(owner.address);
  });

  it('should not allow withdrawal above 0.1ETH at a time', async function() {
    const { faucet, amount } = await loadFixture(deployContractAndSetVariables);
    await expect(faucet.withdraw(amount)).to.be.reverted;
  });

  it('should not allow NOT OWNER to withdraw all funds', async function () {
    const { faucet, notOwner } = await loadFixture(deployContractAndSetVariables);
    await expect(faucet.connect(notOwner).withdrawAll()).to.be.revertedWith('Not owner');
  });

  it('should allow OWNER to withdraw the contract balance', async function () {
    const { faucet, owner, amount } = await loadFixture(deployContractAndSetVariables);
    await expect(() => faucet.withdrawAll()).to.changeEtherBalance(owner, amount);
  });

  it('should not allow NOT OWNER to destroy faucet', async function () {
    const { faucet, notOwner } = await loadFixture(deployContractAndSetVariables);
    await expect(faucet.connect(notOwner).destroyFaucet()).to.be.revertedWith('Not owner');
  });

  it('should allow OWNER to destroy faucet', async function () {
    const { faucet, provider } = await loadFixture(deployContractAndSetVariables);
    await faucet.destroyFaucet();
    expect(await provider.getCode(faucet.runner.address)).to.hexEqual('0x');
  });
});