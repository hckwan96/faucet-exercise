const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Deploy Test", function () {
  it("Should deploy the contract", async function () {
    const Faucet = await ethers.getContractFactory("Faucet");
    const faucet = await Faucet.deploy({ value: ethers.parseEther("1") });
    
    await faucet.waitForDeployment();
    expect(await faucet.getAddress()).to.be.properAddress;
  });
});