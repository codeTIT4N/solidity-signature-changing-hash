import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [`0x${process.env.PVT_KEY}`],
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [`0x${process.env.PVT_KEY}`],
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [`0x${process.env.PVT_KEY}`],
    },
    avax_fuji: {
      url: `https://avalanche-fuji.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [`0x${process.env.PVT_KEY}`],
    },
    arbitrum_goerli: {
      url: `https://arbitrum-goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [`0x${process.env.PVT_KEY}`],
    },
    optimism_goerli: {
      url: `https://optimism-goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [`0x${process.env.PVT_KEY}`],
    },
    fantom_testnet: {
      url: `https://rpc.testnet.fantom.network`, // https://chainlist.org
      accounts: [`0x${process.env.PVT_KEY}`],
    },
    moonbase_alpha: {
      url: `https://rpc.testnet.moonbeam.network`, // https://chainlist.org
      accounts: [`0x${process.env.PVT_KEY}`],
    },
  },
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: false,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY,
      sepolia: process.env.ETHERSCAN_API_KEY,
      polygonMumbai: process.env.POLYGONSCAN_API_KEY,
      avalancheFujiTestnet: process.env.SNOWTRACE_API_KEY,
      arbitrumGoerli: process.env.ARBISCAN_API_KEY,
      optimisticGoerli: process.env.OPTIMISM_ETHERSCAN_API_KEY,
      ftmTestnet: process.env.FTMSCAN_API_KEY,
      moonbaseAlpha: process.env.MOONSCAN_API_KEY,
    },
  },
};

export default config;
