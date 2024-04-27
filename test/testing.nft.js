
// const NftMarket = artifacts.require("NftMarket");

// contract ("NftMarket", (accounts) =>{
//     let _contract = null;

//     before(async () => {
//         if(!deployedAddress) {
//             console.error("Please provide the deployed Nft Market contract address");
//             process.exit(1)
//         }
//         _contract =await  NftMarket.at(deployedAddress)
//     })
// })















// const NftMarket = artifacts.require("NftMarket");
// const { ethers } = require("ethers");

// contract("NftMarket", accounts => {
//   let _contract = null;
//   let _listingPrice = ethers.utils.parseEther("0.025").toString();

//   before(async () => {
//     _contract = await NftMarket.deployed();
//   })

//   describe("Mint token", () => {
//     const tokenURI = "https://test.com";
//     before(async () => {
//       await _contract.mintToken(tokenURI, ethers.utils.parseEther("0.3").toString(), {
//         from: accounts[0],
//         value: _listingPrice
//       })
//     })

//     it("owner of the first token should be address[0]", async () => {
//       const owner = await _contract.ownerOf(1);
//       assert.equal(owner, accounts[0], "Owner of token is not matching address[0]");
//     })

//     it("first token should point to the correct tokenURI", async () => {
//       const actualTokenURI = await _contract.tokenURI(1);

//       assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
//     })

//     it("should not be possible to create a NFT with used tokenURI", async () => {
//       try {
//         await _contract.mintToken(tokenURI, ethers.utils.parseEther("0.4").toString(), {
//           from: accounts[0],
//           value: _listingPrice
//         })
//       } catch(error) {
//         assert(error, "NFT was minted with previously used tokenURI");
//       }
//     })

//     it("should have one listed item", async () => {
//       const listedItemCount = await _contract.listedItemsCount();
//       assert.equal(listedItemCount.toNumber(), 1, "Listed items count is not 1");
//     })

//     it("should have create NFT item", async () => {
//       const nftItem = await _contract.getNftItem(1);

//       assert.equal(nftItem.tokenId.toNumber(), 1, "Token id is not 1");
//       assert.equal(nftItem.price, ethers.utils.parseEther("0.3").toString(), "Nft price is not correct");
//       assert.equal(nftItem.creator, accounts[0], "Creator is not account[0]");
//       assert.equal(nftItem.isListed, true, "Token is not listed");
//     })
//   })
// })

































// const NftMarket = artifacts.require("NftMarket");
// const { ethers } = require("ethers");

// contract("NftMarket", accounts => {
//   let _contract = null;
//   let _nftPrice = ethers.utils.parseEther("0.3").toString();
//   let _listingPrice = ethers.utils.parseEther("0.025").toString();

//   before(async () => {
//     _contract = await NftMarket.deployed();
//   });

//   describe("Mint token", () => {
//     const tokenURI = "https://test.com";
//     before(async () => {
//       await _contract.mintToken(tokenURI, _nftPrice, {
//         value: _listingPrice
//       });
//     });

//     it("owner of the first token should be address[0]", async () => {
//       const owner = await _contract.ownerOf(1);
//       assert.equal(owner, accounts[0], "Owner of token is not matching address[0]");
//     });

//     it("first token should point to the correct tokenURI", async () => {
//       const actualTokenURI = await _contract.tokenURI(1);

//       assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
//     });

//     it("should not be possible to create a NFT with used tokenURI", async () => {
//       try {
//         await _contract.mintToken(tokenURI, _nftPrice, {
//           from: accounts[0]
//         });
//         assert.fail("Expected an error but did not get one");
//       } catch(error) {
//         assert(error.toString().includes("Token URI already exists"), "NFT was minted with previously used tokenURI");
//       }
//     });

//     it("should have one listed item", async () => {
//       const listedItemCount = await _contract.listedItemsCount();
//       assert.equal(listedItemCount.toNumber(), 1, "Listed items count is not 1");
//     });

//     it("should have created NFT item", async () => {
//       const nftItem = await _contract.getNftItem(1);

//       assert.equal(nftItem.tokenId, 1, "Token id is not 1");
//       assert.equal(nftItem.price, _nftPrice, "NFT price is not correct");
//       assert.equal(nftItem.creator, accounts[0], "Creator is not account[0]");
//       assert.equal(nftItem.isListed, true, "Token is not listed");
//     });
//   });
// });






































const NftMarket = artifacts.require("NftMarket");

contract("NftMarket", (accounts) => {
  let _contract;

  before(async () => {
    _contract = await NftMarket.deployed();
  });

  describe("Mint token", () => {
    const tokenURI = "https://test.com";
    const nftPrice = web3.utils.toWei("0.3", "ether");
    const listingPrice = web3.utils.toWei("0.025", "ether");

    before(async () => {
      await _contract.mintToken(tokenURI, nftPrice, {
        value: listingPrice,
        from: accounts[0]
      });
    });

    it("owner of the first token should be address[0]", async () => {
      const owner = await _contract.ownerOf(1);
      assert.equal(owner, accounts[0], "Owner of token is not matching address[0]");
    });

    it("first token should point to the correct tokenURI", async () => {
      const actualTokenURI = await _contract.tokenURI(1);
      assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
    });

    it("should not be possible to create a NFT with used tokenURI", async () => {
      try {
        await _contract.mintToken(tokenURI, nftPrice, {
          value: listingPrice,
          from: accounts[0]
        });
        assert.fail("Expected an error but did not get one");
      } catch(error) {
        assert(error.toString().includes("Token URI already exists"), "NFT was minted with previously used tokenURI");
      }
    });

    it("should have one listed item", async () => {
      const listedItemCount = await _contract.listedItemsCount();
      assert.equal(listedItemCount.toNumber(), 1, "Listed items count is not 1");
    });

    it("should have created NFT item", async () => {
      const nftItem = await _contract.getNftItem(1);

      assert.equal(nftItem.tokenId, 1, "Token id is not 1");
      assert.equal(nftItem.price, nftPrice, "NFT price is not correct");
      assert.equal(nftItem.creator, accounts[0], "Creator is not account[0]");
      assert.equal(nftItem.isListed, true, "Token is not listed");
    });
  });
});
