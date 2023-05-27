import { BytesLike } from "ethers";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PVT_KEY: BytesLike;
      INFURA_API_KEY: string;
      ETHERSCAN_API_KEY: string;
      POLYGONSCAN_API_KEY: string;
      SNOWTRACE_API_KEY: string;
      ARBISCAN_API_KEY: string;
      OPTIMISM_ETHERSCAN_API_KEY: string;
      FTMSCAN_API_KEY: string;
      MOONSCAN_API_KEY: string;
    }
  }
}
