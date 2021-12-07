require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const ALCHEMY_API_KEY = "oHZzw7Gz3hKnVx3DMqtPTRU1aKTcWOht";
const ETHERSCAN_API_KEY = "VU6JKB1IVTDAWW85KF9QXK3KKTJDN8APEB";

const ROPSTEN_PRIVATE_KEY = "b154667a990584da7dfb740c8d57499e19a4c96e117387adc9d708ce3cb2bf77";

module.exports = {
  solidity: "0.7.3",
  networks: {
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${ROPSTEN_PRIVATE_KEY}`],
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY
  }
};
