require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");
require("dotenv").config();
module.exports = {
  solidity: "0.8.28",
  networks: {
    localhost: { url: "http://127.0.0.1:8545", chainId: 31337 },
    amoy: { url: process.env.AMOY_RPC_URL || "https://polygon-amoy.drpc.org", chainId: 80002,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [] }
  }
};
