const assert = require('assert');
const NftMarket = artifacts.require("NftMarket");

contract("NftMarket", (accounts) => {
    let _contract;
    const nftPrice = web3.utils.toWei("5", "ether");
    const listingPrice = web3.utils.toWei("0.025", "ether");

    before(async () => {
        _contract = await NftMarket.new();
    });

    beforeEach(async () => {
        // Reset the _listedItemsCount before each test case
        await _contract.resetListedItemsCount();
    });

    describe("MintToken", () => {
        it("owner first token address[0] is required", async () => {
            const tokenURI = "https://nfttoken.com/1";
            await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
            const owner = await _contract.ownerOf(1);
            assert.equal(owner, accounts[0], "owner address[0] is not matching");
        });

        it("owner of the first token should be address[0]", async () => {
            const owner = await _contract.ownerOf(1);
            assert.equal(owner, accounts[0], "Owner of token is not matching address[0]");
        })

        it("first token should be point to the correct tokenURI", async () => {
            const tokenURI = "https://nfttoken.com/2";
            await _contract.mintToken(tokenURI, nftPrice, {
                value: listingPrice,
                from: accounts[0],
            });
            const actualTokenURI = await _contract.tokenURI(2);
            assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
        });

        it("should not be possible to create a nft with used tokenRI", async () => {
            const tokenURI = "https://nfttoken.com/3";
            await _contract.mintToken(tokenURI, nftPrice, {
                value: listingPrice,
                from: accounts[0],
            });
            try {
                await _contract.mintToken(tokenURI, nftPrice, {
                    value: listingPrice,
                    from: accounts[0],
                });
                assert.fail("Expected error but did not get one");
            } catch (error) {
                assert(
                    error.toString().includes("Token URI already exists"),
                    "nft minted with previous URI"
                );
            }
        });

        it("should have only one listed items", async () => {
            const tokenURI = "https://nfttoken.com/4";
            await _contract.mintToken(tokenURI, nftPrice, {
                value: listingPrice,
                from: accounts[0],
            });
            const listedItemsCount = await _contract.listedItemsCount();
            assert.equal(listedItemsCount.toNumber(), 1, "listed items count is not 1");
        });

        it("should have created NFT items", async () => {
            const tokenURI = "https://nfttoken.com/5";
            await _contract.mintToken(tokenURI, nftPrice, {
                value: listingPrice,
                from: accounts[0],
            });
            const nftItem = await _contract.getNftItem(5);
            assert.equal(nftItem.tokenId, 5, "token id not 5");
            assert.equal(nftItem.price, nftPrice, "nft price is not correct");
            assert.equal(nftItem.creator, accounts[0], "nft creator account is not matched");
            assert.equal(nftItem.isListed, true, "NFT token is not listed yet");
        });
    });

    describe("Buy NFT", () => {
        before(async () => {
            const tokenURI = "https://nfttoken.com/6";
            await _contract.mintToken(tokenURI, nftPrice, {
                value: listingPrice,
                from: accounts[0],
            });
            await _contract.buyNft(1, {
                from: accounts[1],
                value: nftPrice
            });
        });

        it("should unlist the item", async () => {
            const listedItem = await _contract.getNftItem(1);
            assert.equal(listedItem.isListed, false, "Item is still listed");
        });

        it("should decrease listed items count", async () => {
            const listedItemsCount = await _contract.listedItemsCount();
            assert.equal(listedItemsCount.toNumber(), 0, "Count has not been decremented");
        });

        it("should change the owner", async () => {
            const currentOwner = await _contract.ownerOf(1);
            assert.equal(currentOwner, accounts[1], "Owner has not been changed");
        });
    });
    
    describe("Token Transfer", () => {
        const tokenURI1= "https://ourminitingToken1.com";
        const tokenURI2= "https://ourminitingToken2.com";
    
        before(async () => {
            await _contract.mintToken(tokenURI1, nftPrice, { from: accounts[0], value: listingPrice });
            await _contract.mintToken(tokenURI2, nftPrice, { from: accounts[0], value: listingPrice });
        });
    
        it("should be able to retrieve nft by index", async () => {
            const nftId1 = await _contract.tokenByIndex(0);
            const nftId2 = await _contract.tokenByIndex(1);
            assert.equal(nftId1.toNumber(), 1, "Nft id is wrong");
            assert.equal(nftId2.toNumber(), 2, "Nft id is wrong");
        });
    });
    
});






























// const assert = require('assert');
// const NftMarket = artifacts.require("NftMarket");

// contract("NftMarket", (accounts) => {
//     let _contract;
//     const nftPrice = web3.utils.toWei("5", "ether");
//     const listingPrice = web3.utils.toWei("0.025", "ether");

//     before(async () => {
//         _contract = await NftMarket.new();
//     });

//     beforeEach(async () => {
//         // Reset the _listedItemsCount before each test case
//         await _contract.resetListedItemsCount();
//     });

//     describe("MintToken", () => {
//         it("owner first token address[0] is required", async () => {
//             const tokenURI = "https://nfttoken.com/1";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             const owner = await _contract.ownerOf(1);
//             assert.equal(owner, accounts[0], "owner address[0] is not matching");
//         });

//         it("owner of the first token should be address[0]", async () => {
//             const owner = await _contract.ownerOf(1);
//             assert.equal(owner, accounts[0], "Owner of token is not matching address[0]");
//         })

//         it("first token should be point to the correct tokenURI", async () => {
//             const tokenURI = "https://nfttoken.com/2";
//             await _contract.mintToken(tokenURI, nftPrice, {
//                 value: listingPrice,
//                 from: accounts[0],
//             });
//             const actualTokenURI = await _contract.tokenURI(2);
//             assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
//         });

//         it("should not be possible to create a nft with used tokenRI", async () => {
//             const tokenURI = "https://nfttoken.com/3";
//             await _contract.mintToken(tokenURI, nftPrice, {
//                 value: listingPrice,
//                 from: accounts[0],
//             });
//             try {
//                 await _contract.mintToken(tokenURI, nftPrice, {
//                     value: listingPrice,
//                     from: accounts[0],
//                 });
//                 assert.fail("Expected error but did not get one");
//             } catch (error) {
//                 assert(
//                     error.toString().includes("Token URI already exists"),
//                     "nft minted with previous URI"
//                 );
//             }
//         });

//         it("should have only one listed items", async () => {
//             const tokenURI = "https://nfttoken.com/4";
//             await _contract.mintToken(tokenURI, nftPrice, {
//                 value: listingPrice,
//                 from: accounts[0],
//             });
//             const listedItemsCount = await _contract.listedItemsCount();
//             assert.equal(listedItemsCount.toNumber(), 1, "listed items count is not 1");
//         });

//         it("should have created NFT items", async () => {
//             const tokenURI = "https://nfttoken.com/5";
//             await _contract.mintToken(tokenURI, nftPrice, {
//                 value: listingPrice,
//                 from: accounts[0],
//             });
//             const nftItem = await _contract.getNftItem(5);
//             assert.equal(nftItem.tokenId, 5, "token id not 5");
//             assert.equal(nftItem.price, nftPrice, "nft price is not correct");
//             assert.equal(nftItem.creator, accounts[0], "nft creator account is not matched");
//             assert.equal(nftItem.isListed, true, "NFT token is not listed yet");
//         });
//     });

//     describe("Buy NFT", () => {
//         before(async () => {
//             const tokenURI = "https://nfttoken.com/6";
//             await _contract.mintToken(tokenURI, nftPrice, {
//                 value: listingPrice,
//                 from: accounts[0],
//             });
//             await _contract.buyNft(1, {
//                 from: accounts[1],
//                 value: nftPrice
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
//             assert.equal(currentOwner, accounts[1], "Owner has not been changed");
//         });
//     });



//     describe(" Token Trnasfer", () => {
//         const tokenURI1= "https://ourminitingToken1.com";
//         const tokenURI2= "https://ourminitingToken2.com";

//         before( async() => {
//             await _contract.mintToken(tokenURI1, nftPrice , {
//                 from:accounts[0],
//                 value:listingPrice
//             })
//             await _contract.mintToken(tokenURI2, nftPrice , {
//                 from:accounts[0],
//                 value:listingPrice
//             });

//             it("should be able to retrive nft by index", async ()=>{
//                 const nftId1 = await _contract.tokenByIndex(0)
//                 const nftId2 = await _contract.tokenByIndex(1)
//                 assert.equal()(nftId1.toNumber(), 1, "nft id is not right")
//                 assert.equal()(nftId2.toNumber(), 2, "nft id is not right")
//             })

//         });
//     });

    
 
// });













































































    // describe("Token Transfer", () => {
    //     const tokenURI1 = "https://test-json-1.com";
    //     const tokenURI2 = "https://test-json-2.com";

    //     before(async () => {
    //         await _contract.mintToken(tokenURI1, nftPrice, { from: accounts[0], value: listingPrice });
    //         await _contract.mintToken(tokenURI2, nftPrice, { from: accounts[0], value: listingPrice });
    //     });

    //     it("should be able to retrieve nft by index", async () => {
    //         const nftId1 = await _contract.tokenByIndex(0);
    //         const nftId2 = await _contract.tokenByIndex(1);
    //         assert.equal(nftId1.toNumber(), 1, "Nft id is wrong");
    //         assert.equal(nftId2.toNumber(), 2, "Nft id is wrong");
    //     });
    // }); 







// const assert = require('assert');
// const NftMarket = artifacts.require("NftMarket");

// contract("NftMarket", (accounts) => {
//     let _contract;
//     const nftPrice = web3.utils.toWei("5", "ether");
//     const listingPrice = web3.utils.toWei("0.5", "ether");

//     before(async () => {
//         _contract = await NftMarket.new();
//     });

//     beforeEach(async () => {
//         // Reset the _listedItemsCount before each test case
//         await _contract.resetListedItemsCount();
//     });

//     describe("MintToken", () => {
//         it("owner first token address[0] is required", async () => {
//             const tokenURI = "https://nfttoken.com/1";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             const owner = await _contract.ownerOf(1);
//             assert.equal(owner, accounts[0], "owner address[0] is not matching");
//         });

//         it("owner of the first token should be address[0]", async () => {
//             const owner = await _contract.ownerOf(1);
//             assert.equal(owner, accounts[0], "Owner of token is not matching address[0]");
//           })

//         it("first token should be point to the correct tokenURI", async () => {
//             const tokenURI = "https://nfttoken.com/2";
//             await _contract.mintToken(tokenURI, nftPrice, {
//                 value: listingPrice,
//                 from: accounts[0],
//             });
//             const actualTokenURI = await _contract.tokenURI(2);
//             assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
//         });

//         it("should not be possible to create a nft with used tokenRI", async () => {
//             const tokenURI = "https://nfttoken.com/3";
//             await _contract.mintToken(tokenURI, nftPrice, {
//                 value: listingPrice,
//                 from: accounts[0],
//             });
//             try {
//                 await _contract.mintToken(tokenURI, nftPrice, {
//                     value: listingPrice,
//                     from: accounts[0],
//                 });
//                 assert.fail("Expected error but did not get one");
//             } catch (error) {
//                 assert(
//                     error.toString().includes("Token URI already exists"),
//                     "nft minted with previous URI"
//                 );
//             }
//         });

//         it("should have only one listed items", async () => {
//             const tokenURI = "https://nfttoken.com/4";
//             await _contract.mintToken(tokenURI, nftPrice, {
//                 value: listingPrice,
//                 from: accounts[0],
//             });
//             const listedItemsCount = await _contract.listedItemsCount();
//             assert.equal(listedItemsCount.toNumber(), 1, "listed items count is not 1");
//         });

//         it("should have created NFT items", async () => {
//             const tokenURI = "https://nfttoken.com/5";
//             await _contract.mintToken(tokenURI, nftPrice, {
//                 value: listingPrice,
//                 from: accounts[0],
//             });
//             const nftItem = await _contract.getNftItem(5);
//             assert.equal(nftItem.tokenId, 5, "token id not 5");
//             assert.equal(nftItem.price, nftPrice, "nft price is not correct");
//             assert.equal(nftItem.creator, accounts[0], "nft creator account is not matched");
//             assert.equal(nftItem.isListed, true, "NFT token is not listed yet");
//         });
        
//     }); 

    
//     describe("Buy NFT", () => {
//             before(async () => {
//       await _contract.buyNft(1, {
//         from: accounts[1],
//         value: nftPrice
//       })
//     })

//         it("should unlist the item", async () => { 
//             const listedItem = await _contract.getNftItem(6);
//             assert.equal(listedItem.isListed, false, "Item is still listed");
//         });


//         it("should decrease listedItem count", async () => { 
//             const listedItemsCount = await _contract.listedItemsCount();
//             assert.equal(listedItemsCount.toNumber(), 0, "count Has Not Been Decremented");
//         });


//         it("should change the owner", async () => { 
//             const currentOwner = await _contract.ownerOf(1);
//             assert.equal(currentOwner, accounts[1],  "owner has not been changed");
//         });


//     });
// });





















































// describe("Buy NFT", () => {

//     before(async () => {
// await _contract.buyNft(1, {
// from: accounts[1],
// value: nftPrice
// })
// })


// it("should unlist the item", async () => { 
//     // const tokenURI = "https://nfttoken.com/6"; // Use a new tokenURI
//     // await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//     // await _contract.buyNft(6, { from: accounts[1], value: nftPrice });
//     const listedItem = await _contract.getNftItem(6);
//     assert.equal(listedItem.isListed, false, "Item is still listed");
// });

// it("should decrease listed items count", async () => {
//     // const tokenURI = "https://nfttoken.com/7"; // Use a new tokenURI
//     // await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//     // await _contract.buyNft(7, { from: accounts[1], value: nftPrice });
//     const listedItemsCount = await _contract.listedItemsCount();
//     assert.equal(listedItemsCount.toNumber(), 0, "Count has not been decremented");
// });

// it("should change the owner", async () => {
//     // const tokenURI = "https://nfttoken.com/8"; // Use a new tokenURI
//     // await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//     // await _contract.buyNft(8, { from: accounts[1], value: nftPrice });
//     const currentOwner = await _contract.ownerOf(1);
//     assert.equal(currentOwner, accounts[1], "Owner has not been changed");
// });
// });