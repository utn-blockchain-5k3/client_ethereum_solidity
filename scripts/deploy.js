const { ethers, artifacts } = require("hardhat");
const fs = require("node:fs/promises");
async function main() {
  const contract = await (await ethers.getContractFactory("MiContrato")).deploy();
  await contract.waitForDeployment();
  const { chainId } = await ethers.provider.getNetwork();
  const { abi } = await artifacts.readArtifact("MiContrato");
  const deployment = { address: await contract.getAddress(), chainId: Number(chainId), abi };
  await fs.mkdir("public", { recursive: true });
  await fs.writeFile("public/deployment.json", JSON.stringify(deployment, null, 2) + "\n");
  console.log("Contrato desplegado:", deployment.address, "Red:", deployment.chainId);
  console.log("ABI y dirección exportadas a public/deployment.json");
}
main().catch(error => { console.error(error); process.exitCode = 1; });
