const { assert } = require("console");

const NftMarket = artifacts.require("NftMarket");

contract ("NftMarket", (accounts) =>{
    let _contract;

    before(async () => {
        _contract =await  NftMarket.deployed();
    });

    describe(" Mint token ", ()=>{
      const tokenURI = "https://nfttoken.com";
      const nftPrice = web3.utils.toWei("5", "ether");
      const listingPrice = web3.utils.toWei("0.5", "ether");

    })

    before( async ()=>{
      await _contract.mintToken(tokenURI, nftPrice, {
        value: listingPrice,
        from: accounts[0]
      })

      it("owner first token  address[0] is required", async ()=>{
        const owner =await _contract.ownerOf(1);
        assert.equal(owner, accounts[0], " owner address[0] is not matching ");
      });

      it("first token should be point to the correct tokenURI", async ()=>{
        const actualTokenURI = await _contract.tokenURI(1);
        assert.equal (actualTokenURI, tokenURI, " tokenURI is not correctly set");
      })

      it("should not be possible to create a nft with used tokenRI", async ()=>{
        try {
          await _contract.mintToken(tokenURI, nftPrice, {
            value: listingPrice,
            from: accounts[0]
          });

          assert.fail("Expected  error but did not get one")
        } catch (error) {
          assert(error.toString().include("tokenURI already exist"), "nft minted with previous URI");
        }
      })

      it("should have only one listed items", async ()=>{
        const listedItemsCount =await _contract.listedItemsCount();
        assert.equal(listedItemsCount.toNumber(),1, "listed items count is not 1");
      })

      it("should have created NFT items", async () =>{
        const nftItem = await _contract.getNftItem(1);

        assert.equal(nftItem.tokenId, 1, "token id not 1");
        assert.equal(nftItem.price, nftPrice, "nft price is not correct");
        assert.equal(nftItem.creator, accounts[0], "nft creator account is not matched");
        assert.equal(nftItem.isListed, isListed, "NFT token is not listed yet");

      })




      

      describe("Buy NFT", () => {
        before(async () => {
          await _contract.buyNft(1, {
            from: accounts[1],
            value: _nftPrice
          })
        })
    
        it("should unlist the item", async () => {
          const listedItem = await _contract.getNftItem(1);
          assert.equal(listedItem.isListed, false, "Item is still listed");
        })
    
        it("should decrease listed items count", async () => {
          const listedItemsCount = await _contract.listedItemsCount();
          assert.equal(listedItemsCount.toNumber(), 0, "Count has not been decrement");
        })
    
        it("should change the owner", async () => {
          const currentOwner = await _contract.ownerOf(1);
          assert.equal(currentOwner, accounts[1], "Item is still listed");
        })
      })


    })

})








// const { assert } = require("console");

// const NftMarket = artifacts.require("NftMarket");

// contract("NftMarket", (accounts) => {
//     let _contract;
//     const tokenURI = "https://nfttoken.com";
//     const nftPrice = web3.utils.toWei("5", "ether");
//     const listingPrice = web3.utils.toWei("0.5", "ether");

//     before(async () => {
//         _contract = await NftMarket.deployed();
//         await _contract.mintToken(tokenURI, nftPrice, {
//             value: listingPrice,
//             from: accounts[0]
//         });
//     });

//     describe("Mint token", () => {
//         it("owner of the first token is accounts[0]", async () => {
//             const owner = await _contract.ownerOf(1);
//             assert.equal(owner, accounts[0], "Owner address[0] does not match");
//         });

//         it("first token should point to the correct tokenURI", async () => {
//             const actualTokenURI = await _contract.tokenURI(1);
//             assert.equal(actualTokenURI, tokenURI, "TokenURI is not correctly set");
//         });

//         it("should not be possible to create an NFT with a used tokenURI", async () => {
//             try {
//                 await _contract.mintToken(tokenURI, nftPrice, {
//                     value: listingPrice,
//                     from: accounts[0]
//                 });
//                 assert.fail("Expected error but did not get one");
//             } catch (error) {
//                 assert(error.toString().includes("tokenURI already exists"), "NFT minted with a previous URI");
//             }
//         });

//         it("should have only one listed item", async () => {
//             const listedItemsCount = await _contract.listedItemsCount();
//             assert.equal(listedItemsCount.toNumber(), 1, "Listed items count is not 1");
//         });

//         it("should have created NFT items", async () => {
//             const nftItem = await _contract.getNftItem(1);
//             assert.equal(nftItem.tokenId, 1, "Token ID is not 1");
//             assert.equal(nftItem.price, nftPrice, "NFT price is not correct");
//             assert.equal(nftItem.creator, accounts[0], "NFT creator account does not match");
//             assert.equal(nftItem.isListed, true, "NFT token is not listed");
//         });
//     });

//     describe("Buy NFT", () => {
//         const buyer = accounts[1];
//         const _nftPrice = web3.utils.toWei("5", "ether");

//         before(async () => {
//             await _contract.buyNft(1, {
//                 from: buyer,
//                 value: _nftPrice
//             });
//         });

//         it("should unlist the item", async () => {
//             const listedItem = await _contract.getNftItem(1);
//             assert.equal(listedItem.isListed, false, "Item is still listed");
//         });

//         it("should decrease listed items count", async () => {
//             const listedItemsCount = await _contract.listedItemsCount();
//             assert.equal(listedItemsCount.toNumber(), 0, "Count has not been decremented");
//         });

//         it("should change the owner", async () => {
//             const currentOwner = await _contract.ownerOf(1);
//             assert.equal(currentOwner, buyer, "Owner has not changed");
//         });
//     });
// });













