//  const hardHat = require('@nomiclabs/hardhat-truffle5');

const NftMarket = artifacts.require("./MintToken.sol");
const deployedAddress = process.env.NFT_MARKET_ADDRESS; // Replace with deployed address from truffle console

contract("MintToken", (accounts) => {
    let _contract = null;

    before(async () => {
        if (!deployedAddress) {
            console.error("Please provide the deployed NFT Market contract address!");
            process.exit(1); // Exit if no address provided
        }
        _contract = await NftMarket.at(deployedAddress); // Use at() to fetch deployed contract
    });

});









// const NftMarket = artifacts.require("NftMarket");

// contract("NftMarket", (accounts) => {
//   let nftMarketInstance;

//   before(async () => {
//     nftMarketInstance = await NftMarket.deployed();
//   });

//   it("should mint a new token", async () => {
//     const tokenURI = "http://example.com/token/1";
//     const tokenId = await nftMarketInstance.mintToken(tokenURI, {
//       from: accounts[0],
//       value: web3.utils.toWei("0.1", "ether"), // Assuming minting requires payment
//     });

//     assert.equal(tokenId, 1, "Token ID should be 1");

//     const owner = await nftMarketInstance.ownerOf(tokenId);
//     assert.equal(owner, accounts[0], "Token owner should be the caller");
//   });
// });




















// const NftMarket = artifacts.require("NftMarket");

// contract("NftMarket", accounts => {
//   let _contract = null;

//   before(async () => {
//     _contract = await NftMarket.deployed();
//     console.log(accounts);
//   })

//   describe("Mint token", () => {

//     it("should resolve into true value", () => {
//       let numberOfNfts = 12;
//       assert(numberOfNfts == 12, "Value is NOT true");
//     })
//   })

// })















