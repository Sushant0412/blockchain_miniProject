import hre from "hardhat";

async function main() {
  await hre.run("compile");
  // 0x5ceCe4cBCaa4Bbb3C331A2d8e90f38Dc69A0bf61
  const owners = [
    "0xd7e975fba8e361093ce9d63832c585f471b12803",
    "0x986915705350852a3ec48a0a0926a9a66dafa401",
    "0xffe017499c3f6747cdf4ebf49ea07ebf63c83bd3",
  ];
  const requiredConfirmations = 2;

  const MultiSig = await hre.ethers.getContractFactory("MultiSigWallet");
  const multiSig = await MultiSig.deploy(owners, requiredConfirmations); // deploy returns deployed contract directly

  console.log("MultiSigWallet deployed to:", multiSig.target); // in ethers v6, use .target for address
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
