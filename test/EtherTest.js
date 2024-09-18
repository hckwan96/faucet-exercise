const { ethers } = require("hardhat");

describe("Ethers Availability", function() {
  it("should have access to ethers", function() {
    const { ethers } = require("hardhat");
    // console.log("ethers object:", ethers);
    // console.log("ethers.parseEther:", ethers.parseEther);
    if (!ethers || !ethers.parseEther) {
      throw new Error("ethers or ethers.parseEther is not available");
    }
  });
});