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
    
//     describe("Token Transfer", () => {
//         const tokenURI1 = "https://test-json-1.com";
//         const tokenURI2 = "https://test-json-2.com";
    
//         before(async () => {
//             await _contract.mintToken(tokenURI1, nftPrice, { from: accounts[0], value: listingPrice });
//             await _contract.mintToken(tokenURI2, nftPrice, { from: accounts[0], value: listingPrice });
//         });
    
//         it("should be able to retrieve nft by index", async () => {
//             const nftId1 = await _contract.tokenByIndex(0);
//             const nftId2 = await _contract.tokenByIndex(1);
//             assert.equal(nftId1.toNumber(), 1, "Nft id is wrong");
//             assert.equal(nftId2.toNumber(), 2, "Nft id is wrong");
//         });
//     });

//     describe("Token transfer to new owner", () => {
//         before(async () => {
//             await _contract.transferFrom(
//                 accounts[0],
//                 accounts[1],
//                 2
//             )
//         })
//         it("accounts[0] should own 0 tokens", async () => {
//             const ownedNfts = await _contract.getOwnedNfts({from: accounts[0]});
//             assert.equal(ownedNfts.length, 0, "Invalid length of tokens");
//         })
//         it("accounts[1] should own 2 tokens", async () => {
//             const ownedNfts = await _contract.getOwnedNfts({from: accounts[1]});
//             assert.equal(ownedNfts.length, 2, "Invalid length of tokens");
//         })
//     })

//     describe("List an Nft", () => {
//         before(async () => {
//             await _contract.placeNftOnSale(
//                 1,
//                 nftPrice, { from: accounts[1], value: listingPrice }
//             )
//         })
//         it("should have two listed items", async () => {
//             const listedNfts = await _contract.getAllNftsOnSale();
//             assert.equal(listedNfts.length, 2, "Invalid length of Nfts");
//         })
//         it("should set new listing price", async () => {
//             await _contract
//                 .setListingPrice(_listingPrice, {from: accounts[0]});
//             const listingPrice = await _contract.listingPrice();
//             assert.equal(listingPrice.toString(), _listingPrice, "Invalid Price");
//         })
//     })
    
// });



























// // const { expectRevert } = require('@openzeppelin/test-helpers');
// // const NftMarket = artifacts.require("NftMarket");



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
//         it("should assign the first token to address[0]", async () => {
//             const tokenURI = "https://nfttoken.com/1";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             const owner = await _contract.ownerOf(1);
//             assert.equal(owner, accounts[0], "Owner address[0] is not matching");
//         });

//         it("should point the first token to the correct tokenURI", async () => {
//             const tokenURI = "https://nfttoken.com/2";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             const actualTokenURI = await _contract.tokenURI(2);
//             assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
//         });

//         it("should not allow minting a NFT with a used tokenURI", async () => {
//             const tokenURI = "https://nfttoken.com/3";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             await expectRevert(
//                 _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] }),
//                 "Token URI already exists"
//             );
//         });

//         it("should have only one listed item", async () => {
//             const tokenURI = "https://nfttoken.com/4";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             const listedItemsCount = await _contract.listedItemsCount();
//             assert.equal(listedItemsCount.toNumber(), 1, "Listed items count is not 1");
//         });

//         it("should create NFT items with correct details", async () => {
//             const tokenURI = "https://nfttoken.com/5";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             const nftItem = await _contract.getNftItem(1);
//             assert.equal(nftItem.tokenId.toString(), "1", "Token ID not 1");
//             assert.equal(nftItem.price, nftPrice, "NFT price is not correct");
//             assert.equal(nftItem.creator, accounts[0], "NFT creator account is not matched");
//             assert.equal(nftItem.isListed, true, "NFT token is not listed yet");
//         });
//     });

//     describe("Buy NFT", () => {
//         before(async () => {
//             const tokenURI = "https://nfttoken.com/6";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.buyNft(1, { from: accounts[1], value: nftPrice });
//         });

//         it("should unlist the item after purchase", async () => {
//             const listedItem = await _contract.getNftItem(1);
//             assert.equal(listedItem.isListed, false, "Item is still listed");
//         });

//         it("should decrease the listed items count", async () => {
//             const listedItemsCount = await _contract.listedItemsCount();
//             assert.equal(listedItemsCount.toNumber(), 0, "Count has not been decremented");
//         });

//         it("should change the owner after purchase", async () => {
//             const currentOwner = await _contract.ownerOf(1);
//             assert.equal(currentOwner, accounts[1], "Owner has not been changed");
//         });
//     });

//     describe("Token Transfer", () => {
//         const tokenURI1 = "https://ourmintingtoken1.com";
//         const tokenURI2 = "https://ourmintingtoken2.com";

//         beforeEach(async () => {
//             await _contract.mintToken(tokenURI1, nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.mintToken(tokenURI2, nftPrice, { value: listingPrice, from: accounts[0] });
//         });

//         it("should be able to retrieve NFT by index", async () => {
//             const nftId1 = await _contract.tokenByIndex(0);
//             const nftId2 = await _contract.tokenByIndex(1);
//             assert.equal(nftId1.toNumber(), 1, "NFT ID is wrong");
//             assert.equal(nftId2.toNumber(), 2, "NFT ID is wrong");
//         });
//     });

//     describe("Set Listing Price", () => {
//         it("should set a new listing price", async () => {
//             const newPrice = web3.utils.toWei("0.025", "ether");
//             await _contract.setListingPrice(newPrice, { from: accounts[0] });
//             const updatedPrice = await _contract.listingPrice();
//             assert.equal(updatedPrice.toString(), newPrice, "Listing price is not updated");
//         });
//     });

//     describe("Place NFT on Sale", () => {
//         beforeEach(async () => {
//             const tokenURI = "https://nfttoken.com/7";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//         });

//         it("should place the NFT on sale", async () => {
//             const newPrice = web3.utils.toWei("5", "ether");
//             await _contract.placeNftOnSale(1, newPrice, { from: accounts[0], value: listingPrice });
//             const listedItem = await _contract.getNftItem(1);
//             assert.equal(listedItem.isListed, true, "Item is not listed");
//             assert.equal(listedItem.price.toString(), newPrice, "Price is not updated");
//         });

//         it("should fail to place an already listed NFT on sale with incorrect price", async () => {
//             const newPrice = web3.utils.toWei("5", "ether");
//             await _contract.placeNftOnSale(1, newPrice, { from: accounts[0], value: listingPrice });
//             await expectRevert(
//                 _contract.placeNftOnSale(1, web3.utils.toWei("4", "ether"), { from: accounts[0], value: listingPrice }),
//                 "Price must be equal to listing price"
//             );
//         });
//     });

//     describe("Get All NFTs on Sale", () => {
//         beforeEach(async () => {
//             const tokenURI1 = "https://nfttoken.com/8";
//             const tokenURI2 = "https://nfttoken.com/9";
//             await _contract.mintToken(tokenURI1, nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.mintToken(tokenURI2, nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.placeNftOnSale(1, nftPrice, { from: accounts[0], value: listingPrice });
//             await _contract.placeNftOnSale(2, nftPrice, { from: accounts[0], value: listingPrice });
//         });

//         it("should return all NFTs on sale", async () => {
//             const nftsOnSale = await _contract.getAllNftsOnSale();
//             assert.equal(nftsOnSale.length, 2, "NFTs on sale count is not correct");
//         });
//     });

//     describe("Get Owned NFTs", () => {
//         beforeEach(async () => {
//             const tokenURI1 = "https://nfttoken.com/10";
//             const tokenURI2 = "https://nfttoken.com/11";
//             await _contract.mintToken(tokenURI1, nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.mintToken(tokenURI2, nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.buyNft(1, { from: accounts[1], value: nftPrice });
//             await _contract.buyNft(2, { from: accounts[1], value: nftPrice });
//     });
//         it("should return owned NFTs of account[0]", async () => {
//             const ownedNfts = await _contract.getOwnedNfts({ from: accounts[0] });
//             assert.equal(ownedNfts.length, 0, "Owned NFTs count is not correct");
//         });

//         it("should return owned NFTs of account[1]", async () => {
//             const ownedNfts = await _contract.getOwnedNfts({ from: accounts[1] });
//             assert.equal(ownedNfts.length, 2, "Owned NFTs count is not correct");
//         });
//     });
// });




























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
        });

        it("first token should be point to the correct tokenURI", async () => {
            const tokenURI = "https://nfttoken.com/2";
            await _contract.mintToken(tokenURI, nftPrice, {
                value: listingPrice,
                from: accounts[0],
            });
            const actualTokenURI = await _contract.tokenURI(2);
            assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
        });

        it("should not be possible to create a nft with used tokenURI", async () => {
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

    // describe("Token Transfer", () => {
    //     const tokenURI1= "https://ourminitingToken1.com";
    //     const tokenURI2= "https://ourminitingToken2.com";

    //     before(async () => {
    //         await _contract.mintToken(tokenURI1, nftPrice, { from: accounts[0], value: listingPrice });
    //         await _contract.mintToken(tokenURI2, nftPrice, { from: accounts[0], value: listingPrice });
    //     });

    //     // it("should be able to retrieve nft by index", async () => {
    //     //     const nftId1 = await _contract.tokenByIndex(0);
    //     //     const nftId2 = await _contract.tokenByIndex(1);
    //     //     assert.equal(nftId1.toNumber(), 1, "Nft id is wrong");
    //     //     assert.equal(nftId2.toNumber(), 2, "Nft id is wrong");
    //     // });

    //     // it("should have two listed items", async () => {
    //     //     const listedNfts = await _contract.getAllNftsOnSale();
    //     //     assert.equal(listedNfts.length, 2, "Invalid length of Nfts");
    //     // });

    //     it("should set new listing price", async () => {
    //         await _contract.setListingPrice(listingPrice, { from:accounts[0] });
    //         const newListingPrice = await _contract.listingPrice();
    //         assert.equal(newListingPrice.toString(), listingPrice, "Invalid Price");
    //     });
    // });





    describe("Token Transfer", () => {
        const tokenURI1 = "https://ourmintingToken1.com";
        const tokenURI2 = "https://ourmintingToken2.com";
    
        before(async () => {
            await _contract.mintToken(tokenURI1, nftPrice, { from: accounts[0], value: listingPrice });
            await _contract.mintToken(tokenURI2, nftPrice, { from: accounts[0], value: listingPrice });
        });
    
        // it("should be able to retrieve nft by index", async () => {
        //     const nftId1 = await _contract.tokenByIndex(0);
        //     const nftId2 = await _contract.tokenByIndex(1);
        //     assert.equal(nftId1.toNumber(), 1, "Nft id is wrong");
        //     assert.equal(nftId2.toNumber(), 2, "Nft id is wrong");
        // });
    
        // it("should have two listed items", async () => {
        //     const listedNfts = await _contract.getAllNftsOnSale();
        //     assert.equal(listedNfts.length, 2, "Invalid length of Nfts");
        // });
    
        it("should set new listing price", async () => {
            const newListingPrice = web3.utils.toWei("0.05", "ether");
            await _contract.setListingPrice(newListingPrice, { from: accounts[0] });
            const retrievedListingPrice = await _contract.listingPrice();
            assert.equal(retrievedListingPrice.toString(), newListingPrice, "Invalid Price");
        });
    
        // it("should not allow non-owners to place NFTs on sale", async () => {
        //     const tokenId = 1;
        //     const newPrice = web3.utils.toWei("0.03", "ether");
        //     try {
        //         await _contract.placeNftOnSale(tokenId, newPrice, { from: accounts[1] });
        //         assert.fail("Expected error but did not get one");
        //     } catch (error) {
        //         assert(
        //             error.toString().includes("You are not the owner of this NFT"),
        //             "Non-owner was able to place NFT on sale"
        //         );
        //     }
        // });
    
        // it("should allow owners to place NFTs on sale", async () => {
        //     const tokenId = 1;
        //     const newPrice = web3.utils.toWei("0.03", "ether");
        //     await _contract.placeNftOnSale(tokenId, newPrice, { from: accounts[0] });
        //     const nftItem = await _contract.getNftItem(tokenId);
        //     assert.equal(nftItem.isListed, true, "NFT was not placed on sale");
        //     assert.equal(nftItem.price.toString(), newPrice, "New price was not set");
        // });
    
        // it("should allow buying NFTs on sale", async () => {
        //     const tokenId = 1;
        //     const ownerBalanceBefore = await web3.eth.getBalance(accounts[0]);
        //     await _contract.buyNft(tokenId, { from: accounts[1], value: nftPrice });
        //     const ownerBalanceAfter = await web3.eth.getBalance(accounts[0]);
        //     const nftItem = await _contract.getNftItem(tokenId);
        //     assert.equal(nftItem.isListed, false, "NFT is still listed");
        //     assert(ownerBalanceAfter > ownerBalanceBefore, "Owner balance did not increase");
        // });
    
        it("should not allow buying NFTs with incorrect price", async () => {
            const tokenId = 2;
            const incorrectPrice = web3.utils.toWei("0.02", "ether");
            try {
                await _contract.buyNft(tokenId, { from: accounts[1], value: incorrectPrice });
                assert.fail("Expected error but did not get one");
            } catch (error) {
                assert(
                    error.toString().includes("Please submit the asking price"),
                    "NFT was bought with incorrect price"
                );
            }
        });
    
        // it("should get owned NFTs correctly", async () => {
        //     const ownedNfts = await _contract.getOwnedNfts({ from: accounts[0] });
        //     assert.equal(ownedNfts.length, 2, "Incorrect number of owned NFTs");
        //     assert.equal(ownedNfts[0].tokenId.toNumber(), 1, "Incorrect token ID");
        //     assert.equal(ownedNfts[1].tokenId.toNumber(), 2, "Incorrect token ID");
        // });
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
//         // Reset the contract state before each test case
//         await _contract.resetListedItemsCount();
//     });

//     describe("MintToken", () => {
//         it("should assign the first token to address[0]", async () => {
//             const tokenURI = "https://nfttoken.com/1";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             const owner = await _contract.ownerOf(1);
//             assert.equal(owner, accounts[0], "Owner address[0] is not matching");
//         });

//         it("should point the first token to the correct tokenURI", async () => {
//             const tokenURI = "https://nfttoken.com/2";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             const actualTokenURI = await _contract.tokenURI(2);
//             assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
//         });

//         it("should not allow minting a NFT with a used tokenURI", async () => {
//             const tokenURI = "https://nfttoken.com/3";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             try {
//                 await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//                 assert.fail("Expected error but did not get one");
//             } catch (error) {
//                 assert(error.toString().includes("Token URI already exists"), "NFT minted with previous URI");
//             }
//         });

//         it("should have only one listed item", async () => {
//             const tokenURI = "https://nfttoken.com/4";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             const listedItemsCount = await _contract.listedItemsCount();
//             assert.equal(listedItemsCount.toNumber(), 1, "Listed items count is not 1");
//         });

//         it("should create NFT items with correct details", async () => {
//             const tokenURI = "https://nfttoken.com/5";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             const nftItem = await _contract.getNftItem(1); // Change 5 to 1
//             console.log(nftItem); // Log the nftItem object to understand its structure
//             assert.equal(nftItem.tokenId.toString(), "1", "Token ID not 1"); // Convert to string for comparison
//             assert.equal(nftItem.price, nftPrice, "NFT price is not correct");
//             assert.equal(nftItem.creator, accounts[0], "NFT creator account is not matched");
//             assert.equal(nftItem.isListed, true, "NFT token is not listed yet");
//         });
//     });

//     describe("Buy NFT", () => {
//         before(async () => {
//             const tokenURI = "https://nfttoken.com/6";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.buyNft(1, { from: accounts[1], value: nftPrice });
//         });

//         it("should unlist the item after purchase", async () => {
//             const listedItem = await _contract.getNftItem(1);
//             assert.equal(listedItem.isListed, false, "Item is still listed");
//         });

//         it("should decrease the listed items count", async () => {
//             const listedItemsCount = await _contract.listedItemsCount();
//             assert.equal(listedItemsCount.toNumber(), 0, "Count has not been decremented");
//         });

//         it("should change the owner after purchase", async () => {
//             const currentOwner = await _contract.ownerOf(1);
//             assert.equal(currentOwner, accounts[1], "Owner has not been changed");
//         });
//     });

//     describe("Token Transfer", () => {
//         const tokenURI1 = "https://ourmintingtoken1.com";
//         const tokenURI2 = "https://ourmintingtoken2.com";
    
//         before(async () => {
//             await _contract.mintToken(tokenURI1, nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.mintToken(tokenURI2, nftPrice, { value: listingPrice, from: accounts[0] });
//         });
    
//         it("should be able to retrieve NFT by index", async () => {
//             const totalSupply = await _contract.totalSupply();
//             assert.equal(totalSupply.toNumber(), 2, "Total supply should be 2");
            
//             const nftId1 = await _contract.tokenByIndex(0);
//             const nftId2 = await _contract.tokenByIndex(1);
    
//             assert.equal(nftId1.toNumber(), 1, "NFT ID is wrong");
//             assert.equal(nftId2.toNumber(), 2, "NFT ID is wrong");
//         });
//     });

//     describe("Token transfer to new owner", () => {
//         before(async () => {
//             await _contract.mintToken("https://nfttoken.com/7", nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.mintToken("https://nfttoken.com/8", nftPrice, { value: listingPrice, from: accounts[0] });
//             // Transfer token with ID 1 and 2 from accounts[0] to accounts[1]
//             await _contract.transferFrom(accounts[0], accounts[1], 1);
//             await _contract.transferFrom(accounts[0], accounts[1], 2);
//         });
    
//         it("accounts[0] should own 0 tokens", async () => {
//             const ownedNfts = await _contract.getOwnedNfts({ from: accounts[0] });
//             assert.equal(ownedNfts.length, 0, "Invalid length of tokens");
//         });
    
//         it("accounts[1] should own 2 tokens", async () => {
//             const ownedNfts = await _contract.getOwnedNfts({ from: accounts[1] });
//             assert.equal(ownedNfts.length, 2, "Invalid length of tokens");
//         });
//     });

//     describe("List an Nft", () => {
//         const _listingPrice = web3.utils.toWei("0.025", "ether");

//         before(async () => {
//             await _contract.mintToken("https://nfttoken.com/9", nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.mintToken("https://nfttoken.com/10", nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.placeNftOnSale(1, nftPrice, { from: accounts[0], value: listingPrice });
//             await _contract.placeNftOnSale(2, nftPrice, { from: accounts[0], value: listingPrice });
//         });
        
//         it("should have two listed items", async () => {
//             const listedNfts = await _contract.getAllNftsOnSale();
//             assert.equal(listedNfts.length, 2, "Invalid length of Nfts");
//         });
    
//         it("should set new listing price", async () => {
//             await _contract.setListingPrice(_listingPrice, { from: accounts[0] });
//             const updatedListingPrice = await _contract.listingPrice();
//             assert.equal(updatedListingPrice.toString(), _listingPrice, "Invalid Price");
//         });
//     });
// });


































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
//         // Reset the contract state before each test case
//         await _contract.resetListedItemsCount();
//     });

//     describe("MintToken", () => {
//         it("should assign the first token to address[0]", async () => {
//             const tokenURI = "https://nfttoken.com/1";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             const owner = await _contract.ownerOf(1);
//             assert.equal(owner, accounts[0], "Owner address[0] is not matching");
//         });

//         it("should point the first token to the correct tokenURI", async () => {
//             const tokenURI = "https://nfttoken.com/2";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             const actualTokenURI = await _contract.tokenURI(2);
//             assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
//         });

//         it("should not allow minting a NFT with a used tokenURI", async () => {
//             const tokenURI = "https://nfttoken.com/3";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             try {
//                 await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//                 assert.fail("Expected error but did not get one");
//             } catch (error) {
//                 assert(error.toString().includes("Token URI already exists"), "NFT minted with previous URI");
//             }
//         });

//         it("should have only one listed item", async () => {
//             const tokenURI = "https://nfttoken.com/4";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             const listedItemsCount = await _contract.listedItemsCount();
//             assert.equal(listedItemsCount.toNumber(), 1, "Listed items count is not 1");
//         });

//         it("should create NFT items with correct details", async () => {
//             const tokenURI = "https://nfttoken.com/5";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             const nftItem = await _contract.getNftItem(1); // Change 5 to 1
//             console.log(nftItem); // Log the nftItem object to understand its structure
//             assert.equal(nftItem.tokenId.toString(), "1", "Token ID not 1"); // Convert to string for comparison
//             assert.equal(nftItem.price, nftPrice, "NFT price is not correct");
//             assert.equal(nftItem.creator, accounts[0], "NFT creator account is not matched");
//             assert.equal(nftItem.isListed, true, "NFT token is not listed yet");
//         });
//     });

//     describe("Buy NFT", () => {
//         before(async () => {
//             const tokenURI = "https://nfttoken.com/6";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.buyNft(1, { from: accounts[1], value: nftPrice });
//         });

//         it("should unlist the item after purchase", async () => {
//             const listedItem = await _contract.getNftItem(1);
//             assert.equal(listedItem.isListed, false, "Item is still listed");
//         });

//         it("should decrease the listed items count", async () => {
//             const listedItemsCount = await _contract.listedItemsCount();
//             assert.equal(listedItemsCount.toNumber(), 0, "Count has not been decremented");
//         });

//         it("should change the owner after purchase", async () => {
//             const currentOwner = await _contract.ownerOf(1);
//             assert.equal(currentOwner, accounts[1], "Owner has not been changed");
//         });
//     });

//     // describe("Token Transfer", () => {
//     //     const tokenURI1 = "https://ourmintingtoken1.com";
//     //     const tokenURI2 = "https://ourmintingtoken2.com";

//     //     before(async () => {
//     //         await _contract.mintToken(tokenURI1, nftPrice, { value: listingPrice, from: accounts[0] });
//     //         await _contract.mintToken(tokenURI2, nftPrice, { value: listingPrice, from: accounts[0] });
//     //     });

//     //     it("should be able to retrieve NFT by index", async () => {
//     //         const nftId1 = await _contract.tokenByIndex(0);
//     //         const nftId2 = await _contract.tokenByIndex(1);
//     //         assert.equal(nftId1.toNumber(), 1, "NFT ID is wrong");
//     //         assert.equal(nftId2.toNumber(), 2, "NFT ID is wrong");
//     //     });
//     // });


//     describe("Token Transfer", () => {
//         const tokenURI1 = "https://ourmintingtoken1.com";
//         const tokenURI2 = "https://ourmintingtoken2.com";
    
//         before(async () => {
//             await _contract.mintToken(tokenURI1, nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.mintToken(tokenURI2, nftPrice, { value: listingPrice, from: accounts[0] });
//         });
    
//         it("should be able to retrieve NFT by index", async () => {
//             const totalSupply = await _contract.totalSupply();
//             assert.equal(totalSupply.toNumber(), 2, "Total supply should be 2");
            
//             const nftId1 = await _contract.tokenByIndex(0);
//             const nftId2 = await _contract.tokenByIndex(1);
    
//             assert.equal(nftId1.toNumber(), 1, "NFT ID is wrong");
//             assert.equal(nftId2.toNumber(), 2, "NFT ID is wrong");
//         });
//     });
    



//     // describe("Set Listing Price", () => {
//     //     it("should set a new listing price", async () => {
//     //         const newPrice = web3.utils.toWei("0.025", "ether");
//     //         await _contract.setListingPrice(newPrice, { from: accounts[0] });
//     //         const updatedPrice = await _contract.listingPrice();
//     //         assert.equal(updatedPrice.toString(), newPrice, "Listing price is not updated");
//     //     });
//     // });

//     // describe("Place NFT on Sale", () => {
//     //     before(async () => {
//     //         const tokenURI = "https://nfttoken.com/7";
//     //         await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//     //     });

//     //     it("should place the NFT on sale", async () => {
//     //         const newPrice = web3.utils.toWei("5", "ether"); // Match the listing price
//     //         await _contract.placeNftOnSale(1, newPrice, { from: accounts[0], value: listingPrice });
//     //         const listedItem = await _contract.getNftItem(1);
//     //         assert.equal(listedItem.isListed, true, "Item is not listed");
//     //         assert.equal(listedItem.price.toString(), newPrice, "Price is not updated");
//     //     });
//     // });

//     // describe("Get All NFTs on Sale", () => {
//     //     before(async () => {
//     //         const tokenURI1 = "https://nfttoken.com/8";
//     //         const tokenURI2 = "https://nfttoken.com/9";
//     //         await _contract.mintToken(tokenURI1, nftPrice, { value: listingPrice, from: accounts[0] });
//     //         await _contract.mintToken(tokenURI2, nftPrice, { value: listingPrice, from: accounts[0] });
//     //         await _contract.placeNftOnSale(1, nftPrice, { from: accounts[0], value: listingPrice });
//     //         await _contract.placeNftOnSale(2, nftPrice, { from: accounts[0], value: listingPrice });
//     //     });

//     //     it("should return all NFTs on sale", async () => {
//     //         const nftsOnSale = await _contract.getAllNftsOnSale();
//     //         assert.equal(nftsOnSale.length, 2, "NFTs on sale count is not correct");
//     //     });
//     // });

//     // describe("Get Owned NFTs", () => {
//     //     before(async () => {
//     //         const tokenURI1 = "https://nfttoken.com/10";
//     //         const tokenURI2 = "https://nfttoken.com/11";
//     //         await _contract.mintToken(tokenURI1, nftPrice, { value: listingPrice, from: accounts[0] });
//     //         await _contract.mintToken(tokenURI2, nftPrice, { value: listingPrice, from: accounts[1] });
//     //     });

//     //     it("should get all NFTs of the owner", async () => {
//     //         const ownedNfts = await _contract.getOwnedNfts({ from: accounts[0] });
//     //         assert.equal(ownedNfts.length, 1, "Owned NFTs count is not correct");
//     //     });
//     // });



//     describe("Token transfer to new owner", () => {
//         before(async () => {
//           // Transfer token with ID 2 from accounts[0] to accounts[1]
//           await _contract.transferFrom(accounts[0], accounts[1], 2);
//         });
    
//         it("accounts[0] should own 0 tokens", async () => {
//           const ownedNfts = await _contract.getOwnedNfts({ from: accounts[0] });
//           assert.equal(ownedNfts.length, 0, "Invalid length of tokens");
//         });
    
//         it("accounts[1] should own 2 tokens", async () => {
//           const ownedNfts = await _contract.getOwnedNfts({ from: accounts[1] });
//           assert.equal(ownedNfts.length, 2, "Invalid length of tokens");
//         });
//       });



//       describe("List an Nft", () => {
//         it("should have two listed items", async () => {
//           const listedNfts = await _contract.getAllNftsOnSale();
//           assert.equal(listedNfts.length, 2, "Invalid length of Nfts");
//         });
    
//         it("should set new listing price", async () => {
//           await _contract.setListingPrice(_listingPrice, { from: accounts[0] });
//           const listingPrice = await _contract.listingPrice();
//           assert.equal(listingPrice.toString(), _listingPrice, "Invalid Price");
//         });
//       });
    
// });





















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
//         it("should assign the first token to address[0]", async () => {
//             const tokenURI = "https://nfttoken.com/1";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             const owner = await _contract.ownerOf(1);
//             assert.equal(owner, accounts[0], "Owner address[0] is not matching");
//         });

//         it("should point the first token to the correct tokenURI", async () => {
//             const tokenURI = "https://nfttoken.com/2";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             const actualTokenURI = await _contract.tokenURI(2);
//             assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
//         });

//         it("should not allow minting a NFT with a used tokenURI", async () => {
//             const tokenURI = "https://nfttoken.com/3";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             try {
//                 await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//                 assert.fail("Expected error but did not get one");
//             } catch (error) {
//                 assert(error.toString().includes("Token URI already exists"), "NFT minted with previous URI");
//             }
//         });

//         it("should have only one listed item", async () => {
//             const tokenURI = "https://nfttoken.com/4";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             const listedItemsCount = await _contract.listedItemsCount();
//             assert.equal(listedItemsCount.toNumber(), 1, "Listed items count is not 1");
//         });

//         it("should create NFT items with correct details", async () => {
//             const tokenURI = "https://nfttoken.com/5";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             const nftItem = await _contract.getNftItem(1); // Change 5 to 1
//             console.log(nftItem); // Log the nftItem object to understand its structure
//             assert.equal(nftItem.tokenId.toString(), "1", "Token ID not 1"); // Convert to string for comparison
//             assert.equal(nftItem.price, nftPrice, "NFT price is not correct");
//             assert.equal(nftItem.creator, accounts[0], "NFT creator account is not matched");
//             assert.equal(nftItem.isListed, true, "NFT token is not listed yet");
//         });
//     });

//     describe("Buy NFT", () => {
//         before(async () => {
//             const tokenURI = "https://nfttoken.com/6";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.buyNft(1, { from: accounts[1], value: nftPrice });
//         });

//         it("should unlist the item after purchase", async () => {
//             const listedItem = await _contract.getNftItem(1);
//             assert.equal(listedItem.isListed, false, "Item is still listed");
//         });

//         it("should decrease the listed items count", async () => {
//             const listedItemsCount = await _contract.listedItemsCount();
//             assert.equal(listedItemsCount.toNumber(), 0, "Count has not been decremented");
//         });

//         it("should change the owner after purchase", async () => {
//             const currentOwner = await _contract.ownerOf(1);
//             assert.equal(currentOwner, accounts[1], "Owner has not been changed");
//         });
//     });

//     // describe("Token Transfer", () => {
//     //     const tokenURI1 = "https://ourmintingtoken1.com";
//     //     const tokenURI2 = "https://ourmintingtoken2.com";

//     //     before(async () => {
//     //         await _contract.mintToken(tokenURI1, nftPrice, { value: listingPrice, from: accounts[0] });
//     //         await _contract.mintToken(tokenURI2, nftPrice, { value: listingPrice, from: accounts[0] });
//     //     });

//     //     it("should be able to retrieve NFT by index", async () => {
//     //         const nftId1 = await _contract.tokenByIndex(0);
//     //         const nftId2 = await _contract.tokenByIndex(1);
//     //         assert.equal(nftId1.toNumber(), 1, "NFT ID is wrong");
//     //         assert.equal(nftId2.toNumber(), 2, "NFT ID is wrong");
//     //     });
//     // });




//     //     describe("Token Transfer", () => {
// //         const tokenURI1 = "https://ourmintingtoken1.com";
// //         const tokenURI2 = "https://ourmintingtoken2.com";

// //         beforeEach(async () => {
// //             await _contract.mintToken(tokenURI1, nftPrice, { value: listingPrice, from: accounts[0] });
// //             await _contract.mintToken(tokenURI2, nftPrice, { value: listingPrice, from: accounts[0] });
// //         });

// //         it("should be able to retrieve NFT by index", async () => {
// //             const nftId1 = await _contract.tokenByIndex(0);
// //             const nftId2 = await _contract.tokenByIndex(1);
// //             assert.equal(nftId1.toNumber(), 1, "NFT ID is wrong");
// //             assert.equal(nftId2.toNumber(), 2, "NFT ID is wrong");
// //         });
// //     });


//     describe("Set Listing Price", () => {
//         it("should set a new listing price", async () => {
//             const newPrice = web3.utils.toWei("0.025", "ether");
//             await _contract.setListingPrice(newPrice, { from: accounts[0] });
//             const updatedPrice = await _contract.listingPrice();
//             assert.equal(updatedPrice.toString(), newPrice, "Listing price is not updated");
//         });
//     });





//     describe("Place NFT on Sale", () => {
//         before(async () => {
//             const tokenURI = "https://nfttoken.com/7";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//         });

//         it("should place the NFT on sale", async () => {
//             const newPrice = web3.utils.toWei("5", "ether"); // Match the listing price
//             await _contract.placeNftOnSale(1, newPrice, { from: accounts[0], value: listingPrice });
//             const listedItem = await _contract.getNftItem(1);
//             assert.equal(listedItem.isListed, true, "Item is not listed");
//             assert.equal(listedItem.price.toString(), newPrice, "Price is not updated");
//         });
//     });

//     describe("Get All NFTs on Sale", () => {
//         before(async () => {
//             const tokenURI1 = "https://nfttoken.com/8";
//             const tokenURI2 = "https://nfttoken.com/9";
//             await _contract.mintToken(tokenURI1, nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.mintToken(tokenURI2, nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.placeNftOnSale(1, nftPrice, { from: accounts[0], value: listingPrice });
//             await _contract.placeNftOnSale(2, nftPrice, { from: accounts[0], value: listingPrice });
//         });

//         it("should return all NFTs on sale", async () => {
//             const nftsOnSale = await _contract.getAllNftsOnSale();
//             assert.equal(nftsOnSale.length, 2, "NFTs on sale count is not correct");
//         });
//     });

//     describe("Get Owned NFTs", () => {
//         before(async () => {
//             const tokenURI1 = "https://nfttoken.com/10";
//             const tokenURI2 = "https://nfttoken.com/11";
//             await _contract.mintToken(tokenURI1, nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.mintToken(tokenURI2, nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.buyNft(1, { from: accounts[1], value: nftPrice });
//             await _contract.buyNft(2, { from: accounts[1], value: nftPrice });
//         });

//         it("should return owned NFTs of account[0]", async () => {
//             const ownedNfts = await _contract.getOwnedNfts({ from: accounts[0] });
//             assert.equal(ownedNfts.length, 0, "Owned NFTs count is not correct");
//         });
//     });



//     // describe("Place NFT on Sale", () => {
//     //     before(async () => {
//     //         const tokenURI = "https://nfttoken.com/7";
//     //         await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//     //     });

//     //     it("should place the NFT on sale", async () => {
//     //         const newPrice = web3.utils.toWei("3", "ether");
//     //         await _contract.placeNftOnSale(1, newPrice, { from: accounts[0], value: listingPrice });
//     //         const listedItem = await _contract.getNftItem(1);
//     //         assert.equal(listedItem.isListed, true, "Item is not listed");
//     //         assert.equal(listedItem.price.toString(), newPrice, "Price is not updated");
//     //     });

//     //     it("should fail to place an already listed NFT on sale with incorrect price", async () => {
//     //         try {
//     //             const newPrice = web3.utils.toWei("4", "ether"); // Incorrect price
//     //             await _contract.placeNftOnSale(1, newPrice, { from: accounts[0], value: listingPrice });
//     //             assert.fail("Expected error but did not get one");
//     //         } catch (error) {
//     //             assert(error.toString().includes("Price must be equal to listing price"), "Incorrect error message");
//     //         }
//     //     });
//     // });

//     // describe("Get All NFTs on Sale", () => {
//     //     before(async () => {
//     //         const tokenURI1 = "https://nfttoken.com/8";
//     //         const tokenURI2 = "https://nfttoken.com/9";
//     //         await _contract.mintToken(tokenURI1, nftPrice, { value: listingPrice, from: accounts[0] });
//     //         await _contract.mintToken(tokenURI2, nftPrice, { value: listingPrice, from: accounts[0] });
//     //         await _contract.placeNftOnSale(1, nftPrice, { from: accounts[0], value: listingPrice });
//     //         await _contract.placeNftOnSale(2, nftPrice, { from: accounts[0], value: listingPrice });
//     //     });

//     //     it("should return all NFTs on sale", async () => {
//     //         const nftsOnSale = await _contract.getAllNftsOnSale();
//     //         assert.equal(nftsOnSale.length, 2, "NFTs on sale count is not correct");
//     //     });
//     // });

//     // describe("Get Owned NFTs", () => {
//     //     before(async () => {
//     //         const tokenURI1 = "https://nfttoken.com/10";
//     //         const tokenURI2 = "https://nfttoken.com/11";
//     //         await _contract.mintToken(tokenURI1, nftPrice, { value: listingPrice, from: accounts[0] });
//     //         await _contract.mintToken(tokenURI2, nftPrice, { value: listingPrice, from: accounts[0] });
//     //         await _contract.buyNft(1, { from: accounts[1], value: nftPrice });
//     //         await _contract.buyNft(2, { from: accounts[1], value: nftPrice });
//     //     });

//     //     it("should return owned NFTs of account[0]", async () => {
//     //         const ownedNfts = await _contract.getOwnedNfts({ from: accounts[0] });
//     //         assert.equal(ownedNfts.length, 0, "Owned NFTs count is not correct");
//     //     });

//     //     it("should return owned NFTs of account[1]", async () => {
//     //         const ownedNfts = await _contract.getOwnedNfts({ from: accounts[1] });
//     //         assert.equal(ownedNfts.length, 2, "Owned NFTs count is not correct");
//     //     });
//     // });
// });









































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
//         it("should assign the first token to address[0]", async () => {
//             const tokenURI = "https://nfttoken.com/1";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             const owner = await _contract.ownerOf(1);
//             assert.equal(owner, accounts[0], "Owner address[0] is not matching");
//         });

//         it("should point the first token to the correct tokenURI", async () => {
//             const tokenURI = "https://nfttoken.com/2";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             const actualTokenURI = await _contract.tokenURI(2);
//             assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
//         });

//         it("should not allow minting a NFT with a used tokenURI", async () => {
//             const tokenURI = "https://nfttoken.com/3";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             try {
//                 await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//                 assert.fail("Expected error but did not get one");
//             } catch (error) {
//                 assert(error.toString().includes("Token URI already exists"), "NFT minted with previous URI");
//             }
//         });

//         it("should have only one listed item", async () => {
//             const tokenURI = "https://nfttoken.com/4";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             const listedItemsCount = await _contract.listedItemsCount();
//             assert.equal(listedItemsCount.toNumber(), 1, "Listed items count is not 1");
//         });

//         it("should create NFT items with correct details", async () => {
//             const tokenURI = "https://nfttoken.com/5";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             const nftItem = await _contract.getNftItem(1); // Change 5 to 1
//             console.log(nftItem); // Log the nftItem object to understand its structure
//             assert.equal(nftItem.tokenId.toString(), "1", "Token ID not 1"); // Convert to string for comparison
//             assert.equal(nftItem.price, nftPrice, "NFT price is not correct");
//             assert.equal(nftItem.creator, accounts[0], "NFT creator account is not matched");
//             assert.equal(nftItem.isListed, true, "NFT token is not listed yet");
//         });
//     });

//     describe("Buy NFT", () => {
//         before(async () => {
//             const tokenURI = "https://nfttoken.com/6";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.buyNft(1, { from: accounts[1], value: nftPrice });
//         });

//         it("should unlist the item after purchase", async () => {
//             const listedItem = await _contract.getNftItem(1);
//             assert.equal(listedItem.isListed, false, "Item is still listed");
//         });

//         it("should decrease the listed items count", async () => {
//             const listedItemsCount = await _contract.listedItemsCount();
//             assert.equal(listedItemsCount.toNumber(), 0, "Count has not been decremented");
//         });

//         it("should change the owner after purchase", async () => {
//             const currentOwner = await _contract.ownerOf(1);
//             assert.equal(currentOwner, accounts[1], "Owner has not been changed");
//         });
//     });

//     describe("Token Transfer", () => {
//         const tokenURI1 = "https://ourmintingtoken1.com";
//         const tokenURI2 = "https://ourmintingtoken2.com";

//         before(async () => {
//             await _contract.mintToken(tokenURI1, nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.mintToken(tokenURI2, nftPrice, { value: listingPrice, from: accounts[0] });
//         });

//         it("should be able to retrieve NFT by index", async () => {
//             const nftId1 = await _contract.tokenByIndex(0);
//             const nftId2 = await _contract.tokenByIndex(1);
//             assert.equal(nftId1.toNumber(), 1, "NFT ID is wrong");
//             assert.equal(nftId2.toNumber(), 2, "NFT ID is wrong");
//         });
//     });

//     describe("Set Listing Price", () => {
//         it("should set a new listing price", async () => {
//             const newPrice = web3.utils.toWei("0.05", "ether");
//             await _contract.setListingPrice(newPrice, { from: accounts[0] });
//             const updatedPrice = await _contract.listingPrice();
//             assert.equal(updatedPrice.toString(), newPrice, "Listing price is not updated");
//         });
//     });

//     describe("Place NFT on Sale", () => {
//         before(async () => {
//             const tokenURI = "https://nfttoken.com/7";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//         });

//         it("should place the NFT on sale", async () => {
//             const newPrice = web3.utils.toWei("3", "ether");
//             await _contract.placeNftOnSale(1, newPrice, { from: accounts[0], value: listingPrice });
//             const listedItem = await _contract.getNftItem(1);
//             assert.equal(listedItem.isListed, true, "Item is not listed");
//             assert.equal(listedItem.price.toString(), newPrice, "Price is not updated");
//         });

//         it("should fail to place an already listed NFT on sale with incorrect price", async () => {
//             try {
//                 const newPrice = web3.utils.toWei("4", "ether"); // Incorrect price
//                 await _contract.placeNftOnSale(1, newPrice, { from: accounts[0], value: listingPrice });
//                 assert.fail("Expected error but did not get one");
//             } catch (error) {
//                 assert(error.toString().includes("Price must be equal to listing price"), "Incorrect error message");
//             }
//         });
//     });

//     describe("Get All NFTs on Sale", () => {
//         before(async () => {
//             const tokenURI1 = "https://nfttoken.com/8";
//             const tokenURI2 = "https://nfttoken.com/9";
//             await _contract.mintToken(tokenURI1, nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.mintToken(tokenURI2, nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.placeNftOnSale(1, nftPrice, { from: accounts[0], value: listingPrice });
//             await _contract.placeNftOnSale(2, nftPrice, { from: accounts[0], value: listingPrice });
//         });

//         it("should return all NFTs on sale", async () => {
//             const nftsOnSale = await _contract.getAllNftsOnSale();
//             assert.equal(nftsOnSale.length, 2, "NFTs on sale count is not correct");
//         });
//     });

//     describe("Get Owned NFTs", () => {
//         before(async () => {
//             const tokenURI1 = "https://nfttoken.com/10";
//             const tokenURI2 = "https://nfttoken.com/11";
//             await _contract.mintToken(tokenURI1, nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.mintToken(tokenURI2, nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.buyNft(1, { from: accounts[1], value: nftPrice });
//             await _contract.buyNft(2, { from: accounts[1], value: nftPrice });
//         });

//         it("should return owned NFTs of account[0]", async () => {
//             const ownedNfts = await _contract.getOwnedNfts({ from: accounts[0] });
//             assert.equal(ownedNfts.length, 0, "Owned NFTs count is not correct");
//         });

//         it("should return owned NFTs of account[1]", async () => {
//             const ownedNfts = await _contract.getOwnedNfts({ from: accounts[1] });
//             assert.equal(ownedNfts.length, 2, "Owned NFTs count is not correct");
//         });
//     });
// });



















































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
//         it("should assign the first token to address[0]", async () => {
//             const tokenURI = "https://nfttoken.com/1";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             const owner = await _contract.ownerOf(1);
//             assert.equal(owner, accounts[0], "Owner address[0] is not matching");
//         });

//         it("should point the first token to the correct tokenURI", async () => {
//             const tokenURI = "https://nfttoken.com/2";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             const actualTokenURI = await _contract.tokenURI(2);
//             assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
//         });

//         it("should not allow minting a NFT with a used tokenURI", async () => {
//             const tokenURI = "https://nfttoken.com/3";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             try {
//                 await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//                 assert.fail("Expected error but did not get one");
//             } catch (error) {
//                 assert(error.toString().includes("Token URI already exists"), "NFT minted with previous URI");
//             }
//         });

//         it("should have only one listed item", async () => {
//             const tokenURI = "https://nfttoken.com/4";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             const listedItemsCount = await _contract.listedItemsCount();
//             assert.equal(listedItemsCount.toNumber(), 1, "Listed items count is not 1");
//         });

//         it("should create NFT items with correct details", async () => {
//             const tokenURI = "https://nfttoken.com/5";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             const nftItem = await _contract.getNftItem(5);
//             assert.equal(nftItem.tokenId.toNumber(), 5, "Token ID not 5");
//             assert.equal(nftItem.price, nftPrice, "NFT price is not correct");
//             assert.equal(nftItem.creator, accounts[0], "NFT creator account is not matched");
//             assert.equal(nftItem.isListed, true, "NFT token is not listed yet");
//         });
//     });

//     describe("Buy NFT", () => {
//         before(async () => {
//             const tokenURI = "https://nfttoken.com/6";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.buyNft(1, { from: accounts[1], value: nftPrice });
//         });

//         it("should unlist the item after purchase", async () => {
//             const listedItem = await _contract.getNftItem(1);
//             assert.equal(listedItem.isListed, false, "Item is still listed");
//         });

//         it("should decrease the listed items count", async () => {
//             const listedItemsCount = await _contract.listedItemsCount();
//             assert.equal(listedItemsCount.toNumber(), 0, "Count has not been decremented");
//         });

//         it("should change the owner after purchase", async () => {
//             const currentOwner = await _contract.ownerOf(1);
//             assert.equal(currentOwner, accounts[1], "Owner has not been changed");
//         });
//     });

//     describe("Token Transfer", () => {
//         const tokenURI1 = "https://ourmintingtoken1.com";
//         const tokenURI2 = "https://ourmintingtoken2.com";

//         before(async () => {
//             await _contract.mintToken(tokenURI1, nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.mintToken(tokenURI2, nftPrice, { value: listingPrice, from: accounts[0] });
//         });

//         it("should be able to retrieve NFT by index", async () => {
//             const nftId1 = await _contract.tokenByIndex(0);
//             const nftId2 = await _contract.tokenByIndex(1);
//             assert.equal(nftId1.toNumber(), 1, "NFT ID is wrong");
//             assert.equal(nftId2.toNumber(), 2, "NFT ID is wrong");
//         });
//     });

//     describe("Set Listing Price", () => {
//         it("should set a new listing price", async () => {
//             const newPrice = web3.utils.toWei("0.05", "ether");
//             await _contract.setListingPrice(newPrice, { from: accounts[0] });
//             const updatedPrice = await _contract.listingPrice();
//             assert.equal(updatedPrice.toString(), newPrice, "Listing price is not updated");
//         });
//     });

//     describe("Place NFT on Sale", () => {
//         before(async () => {
//             const tokenURI = "https://nfttoken.com/7";
//             await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//         });

//         it("should place the NFT on sale", async () => {
//             const newPrice = web3.utils.toWei("3", "ether");
//             await _contract.placeNftOnSale(1, newPrice, { from: accounts[0], value: listingPrice });
//             const listedItem = await _contract.getNftItem(1);
//             assert.equal(listedItem.isListed, true, "Item is not listed");
//             assert.equal(listedItem.price.toString(), newPrice, "Price is not updated");
//         });

//         it("should fail to place an already listed NFT on sale with incorrect price", async () => {
//             try {
//                 const newPrice = web3.utils.toWei("4", "ether"); // Incorrect price
//                 await _contract.placeNftOnSale(1, newPrice, { from: accounts[0], value: listingPrice });
//                 assert.fail("Expected error but did not get one");
//             } catch (error) {
//                 assert(error.toString().includes("Price must be equal to listing price"), "Incorrect error message");
//             }
//         });
//     });

//     describe("Get All NFTs on Sale", () => {
//         before(async () => {
//             const tokenURI1 = "https://nfttoken.com/8";
//             const tokenURI2 = "https://nfttoken.com/9";
//             await _contract.mintToken(tokenURI1, nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.mintToken(tokenURI2, nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.placeNftOnSale(1, nftPrice, { from: accounts[0], value: listingPrice });
//             await _contract.placeNftOnSale(2, nftPrice, { from: accounts[0], value: listingPrice });
//         });

//         it("should return all NFTs on sale", async () => {
//             const nftsOnSale = await _contract.getAllNftsOnSale();
//             assert.equal(nftsOnSale.length, 2, "NFTs on sale count is not correct");
//         });
//     });

//     describe("Get Owned NFTs", () => {
//         before(async () => {
//             const tokenURI1 = "https://nfttoken.com/10";
//             const tokenURI2 = "https://nfttoken.com/11";
//             await _contract.mintToken(tokenURI1, nftPrice, { value: listingPrice, from: accounts[0] });
//             await _contract.mintToken(tokenURI2, nftPrice, { value: listingPrice, from: accounts[1] });
//         });

//         it("should return owned NFTs of account[0]", async () => {
//             const ownedNfts = await _contract.getOwnedNfts({ from: accounts[0] });
//             assert.equal(ownedNfts.length, 1, "Owned NFTs count for account[0] is not correct");
//             assert.equal(ownedNfts[0].tokenId.toNumber(), 10, "Token ID of owned NFT is not correct");
//         });

//         it("should return owned NFTs of account[1]", async () => {
//             const ownedNfts = await _contract.getOwnedNfts({ from: accounts[1] });
//             assert.equal(ownedNfts.length, 1, "Owned NFTs count for account[1] is not correct");
//             assert.equal(ownedNfts[0].tokenId.toNumber(), 11, "Token ID of owned NFT is not correct");
//         });
//     });
// });
















































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
//         });

//         it("first token should be point to the correct tokenURI", async () => {
//             const tokenURI = "https://nfttoken.com/2";
//             await _contract.mintToken(tokenURI, nftPrice, {
//                 value: listingPrice,
//                 from: accounts[0],
//             });
//             const actualTokenURI = await _contract.tokenURI(2);
//             assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
//         });

//         it("should not be possible to create a nft with used tokenURI", async () => {
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

//         it("should have only one listed item", async () => {
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

//     describe("Token Transfer", () => {
//         const tokenURI1 = "https://ourmintingtoken1.com";
//         const tokenURI2 = "https://ourmintingtoken2.com";

//         before(async () => {
//             await _contract.mintToken(tokenURI1, nftPrice, { from: accounts[0], value: listingPrice });
//             await _contract.mintToken(tokenURI2, nftPrice, { from: accounts[0], value: listingPrice });
//         });

//         it("should be able to retrieve nft by index", async () => {
//             const nftId1 = await _contract.tokenByIndex(0);
//             const nftId2 = await _contract.tokenByIndex(1);
//             assert.equal(nftId1.toNumber(), 1, "Nft id is wrong");
//             assert.equal(nftId2.toNumber(), 2, "Nft id is wrong");
//         });
//     });

//     describe("Set Listing Price", () => {
//         it("should set the new listing price", async () => {
//             const newPrice = web3.utils.toWei("0.05", "ether");
//             await _contract.setListingPrice(newPrice, { from: accounts[0] });
//             const updatedPrice = await _contract.listingPrice();
//             assert.equal(updatedPrice.toString(), newPrice, "Listing price is not updated");
//         });
//     });

//     // describe("Place NFT on Sale", () => {
//     //     before(async () => {
//     //         const tokenURI = "https://nfttoken.com/7";
//     //         await _contract.mintToken(tokenURI, nftPrice, {
//     //             value: listingPrice,
//     //             from: accounts[0],
//     //         });
//     //     });

//     //     it("should place the NFT on sale", async () => {
//     //         const newPrice = web3.utils.toWei("3", "ether");
//     //         await _contract.placeNftOnSale(1, newPrice, { from: accounts[0], value: listingPrice });

//     //         const listedItem = await _contract.getNftItem(1);
//     //         assert.equal(listedItem.isListed, true, "Item is not listed");
//     //         assert.equal(listedItem.price.toString(), newPrice, "Price is not updated");
//     //     });

//     //     it("should fail to place an already listed NFT on sale", async () => {
//     //         try {
//     //             const newPrice = web3.utils.toWei("4", "ether");
//     //             await _contract.placeNftOnSale(1, newPrice, { from: accounts[0], value: listingPrice });
//     //             assert.fail("Expected error but did not get one");
//     //         } catch (error) {
//     //             assert(error.toString().includes("Item is already on sale"), "Item was listed again");
//     //         }
//     //     });
//     // });






//     // describe("Place NFT on Sale", () => {
//     //     before(async () => {
//     //         const tokenURI = "https://nfttoken.com/7";
//     //         await _contract.mintToken(tokenURI, nftPrice, {
//     //             value: listingPrice,
//     //             from: accounts[0],
//     //         });
//     //     });

//     //     it("should place the NFT on sale", async () => {
//     //         const newPrice = web3.utils.toWei("3", "ether");
//     //         await _contract.placeNftOnSale(1, newPrice, { from: accounts[0], value: listingPrice });

//     //         const listedItem = await _contract.getNftItem(1);
//     //         assert.equal(listedItem.isListed, true, "Item is not listed");
//     //         assert.equal(listedItem.price.toString(), newPrice, "Price is not updated");
//     //     });

//     //     it("should fail to place an already listed NFT on sale with incorrect price", async () => {
//     //         try {
//     //             const newPrice = web3.utils.toWei("4", "ether"); // Incorrect price
//     //             await _contract.placeNftOnSale(1, newPrice, { from: accounts[0], value: listingPrice });
//     //             assert.fail("Expected error but did not get one");
//     //         } catch (error) {
//     //             assert(error.toString().includes("Price must be equal to listing price"), "Incorrect error message");
//     //         }
//     //     });
//     // });
    
//     // describe("Get All NFTs on Sale", () => {
//     //     before(async () => {
//     //         const tokenURI1 = "https://nfttoken.com/8";
//     //         const tokenURI2 = "https://nfttoken.com/9";
//     //         await _contract.mintToken(tokenURI1, nftPrice, {
//     //             value: listingPrice,
//     //             from: accounts[0],
//     //         });
//     //         await _contract.mintToken(tokenURI2, nftPrice, {
//     //             value: listingPrice,
//     //             from: accounts[0],
//     //         });
//     //         await _contract.placeNftOnSale(1, nftPrice, { from: accounts[0], value: listingPrice });
//     //         await _contract.placeNftOnSale(2, nftPrice, { from: accounts[0], value: listingPrice });
//     //     });

//     //     it("should return all NFTs on sale", async () => {
//     //         const nftsOnSale = await _contract.getAllNftsOnSale();
//     //         assert.equal(nftsOnSale.length, 2, "NFTs on sale count is not correct");
//     //     });
//     // });

//     // describe("Get Owned NFTs", () => {
//     //     before(async () => {
//     //         const tokenURI1 = "https://nfttoken.com/10";
//     //         const tokenURI2 = "https://nfttoken.com/11";
//     //         await _contract.mintToken(tokenURI1, nftPrice, { from: accounts[0], value: listingPrice });
//     //         await _contract.mintToken(tokenURI2, nftPrice, { from: accounts[1], value: listingPrice });
//     //     });

//     //     it("should return owned NFTs of account[0]", async () => {
//     //         const ownedNfts = await _contract.getOwnedNfts({ from: accounts[0] });
//     //         assert.equal(ownedNfts.length, 1, "Owned NFTs count for account[0] is not correct");
//     //         assert.equal(ownedNfts[0].tokenId.toNumber(), 10, "Token ID of owned NFT is not correct");
//     //     });

//     //     it("should return owned NFTs of account[1]", async () => {
//     //         const ownedNfts = await _contract.getOwnedNfts({ from: accounts[1] });
//     //         assert.equal(ownedNfts.length, 1, "Owned NFTs count for account[1] is not correct");
//     //         assert.equal(ownedNfts[0].tokenId.toNumber(), 11, "Token ID of owned NFT is not correct");
//     //     });
//     // });






//     describe("Place NFT on Sale", () => {
//         before(async () => {
//             const tokenURI = "https://nfttoken.com/7";
//             await _contract.mintToken(tokenURI, nftPrice, {
//                 value: listingPrice,  // Ensure correct listing price is used here
//                 from: accounts[0],
//             });
//         });
    
//         it("should place the NFT on sale", async () => {
//             const newPrice = web3.utils.toWei("3", "ether");
//             await _contract.placeNftOnSale(1, newPrice, { from: accounts[0], value: listingPrice });
    
//             const listedItem = await _contract.getNftItem(1);
//             assert.equal(listedItem.isListed, true, "Item is not listed");
//             assert.equal(listedItem.price.toString(), newPrice, "Price is not updated");
//         });
    
//         it("should fail to place an already listed NFT on sale with incorrect price", async () => {
//             try {
//                 const newPrice = web3.utils.toWei("4", "ether"); // Incorrect price
//                 await _contract.placeNftOnSale(1, newPrice, { from: accounts[0], value: listingPrice });
//                 assert.fail("Expected error but did not get one");
//             } catch (error) {
//                 assert(error.toString().includes("Price must be equal to listing price"), "Incorrect error message");
//             }
//         });
//     });


//     describe("Get All NFTs on Sale", () => {
//         before(async () => {
//             const tokenURI1 = "https://nfttoken.com/8";
//             const tokenURI2 = "https://nfttoken.com/9";
//             await _contract.mintToken(tokenURI1, nftPrice, {
//                 value: listingPrice,  // Ensure correct listing price is used here
//                 from: accounts[0],
//             });
//             await _contract.mintToken(tokenURI2, nftPrice, {
//                 value: listingPrice,  // Ensure correct listing price is used here
//                 from: accounts[0],
//             });
//             await _contract.placeNftOnSale(1, nftPrice, { from: accounts[0], value: listingPrice });
//             await _contract.placeNftOnSale(2, nftPrice, { from: accounts[0], value: listingPrice });
//         });
    
//         it("should return all NFTs on sale", async () => {
//             const nftsOnSale = await _contract.getAllNftsOnSale();
//             assert.equal(nftsOnSale.length, 2, "NFTs on sale count is not correct");
//         });
//     });

//     describe("Get Owned NFTs", () => {
//         before(async () => {
//             const tokenURI1 = "https://nfttoken.com/10";
//             const tokenURI2 = "https://nfttoken.com/11";
//             await _contract.mintToken(tokenURI1, nftPrice, { 
//                 from: accounts[0], 
//                 value: listingPrice  // Ensure correct listing price is used here 
//             });
//             await _contract.mintToken(tokenURI2, nftPrice, { 
//                 from: accounts[1], 
//                 value: listingPrice  // Ensure correct listing price is used here
//             });
//         });
    
//         it("should return owned NFTs of account[0]", async () => {
//             const ownedNfts = await _contract.getOwnedNfts({ from: accounts[0] });
//             assert.equal(ownedNfts.length, 1, "Owned NFTs count for account[0] is not correct");
//             assert.equal(ownedNfts[0].tokenId.toNumber(), 10, "Token ID of owned NFT is not correct");
//         });
    
//         it("should return owned NFTs of account[1]", async () => {
//             const ownedNfts = await _contract.getOwnedNfts({ from: accounts[1] });
//             assert.equal(ownedNfts.length, 1, "Owned NFTs count for account[1] is not correct");
//             assert.equal(ownedNfts[0].tokenId.toNumber(), 11, "Token ID of owned NFT is not correct");
//         });
//     });
    

// });






































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
    
//     describe("Token Transfer", () => {
//         const tokenURI1= "https://ourminitingToken1.com";
//         const tokenURI2= "https://ourminitingToken2.com";
    
//         before(async () => {
//             await _contract.mintToken(tokenURI1, nftPrice, { from: accounts[0], value: listingPrice });
//             await _contract.mintToken(tokenURI2, nftPrice, { from: accounts[0], value: listingPrice });
//         });
    
//         it("should be able to retrieve nft by index", async () => {
//             const nftId1 = await _contract.tokenByIndex(0);
//             const nftId2 = await _contract.tokenByIndex(1);
//             assert.equal(nftId1.toNumber(), 1, "Nft id is wrong");
//             assert.equal(nftId2.toNumber(), 2, "Nft id is wrong");
//         });
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
    
//         it("should decrease listed items count", async () => {
//             const listedItemsCount = await _contract.listedItemsCount();
//             assert.equal(listedItemsCount.toNumber(), 0, "Count has not been decremented");
//         });
    
//         it("should change the owner", async () => {
//             const currentOwner = await _contract.ownerOf(1);
//             assert.equal(currentOwner, accounts[1], "Owner has not been changed");
//         });
//     });






//     // describe("Token Transfer", () => {
//     //     const tokenURI = "https://test-json-2.com";
    
//     //     before(async () => {
//     //         await _contract.mintToken(tokenURI, nftPrice, { from: accounts[0], value: listingPrice });
//     //         await _contract.mintToken(tokenURI, nftPrice, { from: accounts[0], value: listingPrice });
//     //     });
    
//     //     it("should have two NFTs created", async () => {
//     //         const totalSupply = await _contract.totalSupply();
//     //         assert.equal(totalSupply.toNumber(), 2, "Total supply of token is not correct");
//     //     });
    
//     //     it("should be able to retrieve nft by index", async () => {
//     //         const nftId1 = await _contract.tokenByIndex(0);
//     //         const nftId2 = await _contract.tokenByIndex(1);
//     //         assert.equal(nftId1.toNumber(), 1, "Nft id is wrong");
//     //         assert.equal(nftId2.toNumber(), 2, "Nft id is wrong");
//     //     });
//     // });


// });















// describe("Buy NFT", () => {
//     before(async () => {
//       await _contract.buyNft(1, {
//         from: accounts[1],
//         value: _nftPrice
//       })
//     })

//     it("should unlist the item", async () => {
//       const listedItem = await _contract.getNftItem(1);
//       assert.equal(listedItem.isListed, false, "Item is still listed");
//     })

//     it("should decrease listed items count", async () => {
//       const listedItemsCount = await _contract.listedItemsCount();
//       assert.equal(listedItemsCount.toNumber(), 0, "Count has not been decrement");
//     })

//     it("should change the owner", async () => {
//       const currentOwner = await _contract.ownerOf(1);
//       assert.equal(currentOwner, accounts[1], "Item is still listed");
//     })
//   })






































// const assert = require('assert');
// const NftMarket = artifacts.require("NftMarket");

// contract("NftMarket", (accounts) => {
//     let _contract;

//     before(async () => {
//         _contract = await NftMarket.new();
//     });

//     describe("MintToken", () => {
//         const nftPrice = web3.utils.toWei("5", "ether");
//         const listingPrice = web3.utils.toWei("0.5", "ether");

//         it("owner first token address[0] is required", async () => {
//             const tokenURI = "https://nfttoken.com/1";
//             await _contract.mintToken(tokenURI, nftPrice, {
//                 value: listingPrice,
//                 from: accounts[0],
//             });
//             const owner = await _contract.ownerOf(1);
//             assert.equal(owner, accounts[0], "owner address[0] is not matching");
//         });

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
// });






























// const { assert } = require("console");
// const NftMarket = artifacts.require("NftMarket");

// contract("NftMarket", (accounts) => {
//   let _contract;

//   before(async () => {
//     _contract = await NftMarket.new();
//   });

//   describe("MintToken", () => {
//     const nftPrice = web3.utils.toWei("5", "ether");
//     const listingPrice = web3.utils.toWei("0.5", "ether");

//     it("owner first token address[0] is required", async () => {
//       const tokenURI = "https://nfttoken.com/1";
//       await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//       const owner = await _contract.ownerOf(1);
//       assert.equal(owner, accounts[0], "owner address[0] is not matching");
//     });

//     it("first token should be point to the correct tokenURI", async () => {
//       const tokenURI = "https://nfttoken.com/2";
//       await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//       const actualTokenURI = await _contract.tokenURI(2);
//       assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
//     });

//     it("should not be possible to create a nft with used tokenRI", async () => {
//       const tokenURI = "https://nfttoken.com/3";
//       await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//       try {
//         await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//         assert.fail("Expected error but did not get one");
//       } catch (error) {
//         assert(error.toString().includes("tokenURI already exist"), "nft minted with previous URI");
//       }
//     });

//     it("should have only one listed items", async () => {
//       const tokenURI = "https://nfttoken.com/4";
//       await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//       const listedItemsCount = await _contract.listedItemsCount();
//       assert.equal(listedItemsCount.toNumber(), 1, "listed items count is not 1");
//     });

//     it("should have created NFT items", async () => {
//       const tokenURI = "https://nfttoken.com/5";
//       await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//       const nftItem = await _contract.getNftItem(5);
//       assert.equal(nftItem.tokenId, 5, "token id not 5");
//       assert.equal(nftItem.price, nftPrice, "nft price is not correct");
//       assert.equal(nftItem.creator, accounts[0], "nft creator account is not matched");
//       assert.equal(nftItem.isListed, true, "NFT token is not listed yet");
//     });
//   });
// });



























// const { assert } = require("console");
// const NftMarket = artifacts.require("NftMarket");

// contract("NftMarket", (accounts) => {
//   let _contract;

//   // Deploy the contract in the top-level before hook
//   before(async () => {
//     _contract = await NftMarket.new();
//   });

//   describe("MintToken", () => {
//     const tokenURI = "https://nfttoken.com";
//     const nftPrice = web3.utils.toWei("5", "ether");
//     const listingPrice = web3.utils.toWei("0.5", "ether");

//     it("owner first token address[0] is required", async () => {
//       await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//       const owner = await _contract.ownerOf(1);
//       assert.equal(owner, accounts[0], "owner address[0] is not matching");
//     });

//     it("first token should be point to the correct tokenURI", async () => {
//       await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//       const actualTokenURI = await _contract.tokenURI(1);
//       assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
//     });

//     it("should not be possible to create a nft with used tokenRI", async () => {
//       await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//       try {
//         await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//         assert.fail("Expected error but did not get one");
//       } catch (error) {
//         assert(error.toString().includes("tokenURI already exist"), "nft minted with previous URI");
//       }
//     });

//     it("should have only one listed items", async () => {
//       await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//       const listedItemsCount = await _contract.listedItemsCount();
//       assert.equal(listedItemsCount.toNumber(), 1, "listed items count is not 1");
//     });

//     it("should have created NFT items", async () => {
//       await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//       const nftItem = await _contract.getNftItem(1);
//       assert.equal(nftItem.tokenId, 1, "token id not 1");
//       assert.equal(nftItem.price, nftPrice, "nft price is not correct");
//       assert.equal(nftItem.creator, accounts[0], "nft creator account is not matched");
//       assert.equal(nftItem.isListed, true, "NFT token is not listed yet");
//     });
//   });
// });























// const { assert } = require("console");
// const NftMarket = artifacts.require("NftMarket");

// contract("NftMarket", (accounts) => {
//   let _contract;

//   // Move the deployment of the contract to the before hook
//   before(async () => {
//     _contract = await NftMarket.deployed();
//   });

//   describe("MintToken", () => {
//     const tokenURI = "https://nfttoken.com";
//     const nftPrice = web3.utils.toWei("5", "ether");
//     const listingPrice = web3.utils.toWei("0.5", "ether");

//     let deployedContract;

//     before(async () => {
//       // Deploy a new instance of the contract for each test case
//       deployedContract = await NftMarket.new();
//     });

//     it("owner first token address[0] is required", async () => {
//       await deployedContract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//       const owner = await deployedContract.ownerOf(1);
//       assert.equal(owner, accounts[0], "owner address[0] is not matching");
//     });

//     it("first token should be point to the correct tokenURI", async () => {
//       await deployedContract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//       const actualTokenURI = await deployedContract.tokenURI(1);
//       assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
//     });

//     it("should not be possible to create a nft with used tokenRI", async () => {
//       await deployedContract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//       try {
//         await deployedContract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//         assert.fail("Expected error but did not get one");
//       } catch (error) {
//         assert(error.toString().includes("tokenURI already exist"), "nft minted with previous URI");
//       }
//     });

//     it("should have only one listed items", async () => {
//       await deployedContract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//       const listedItemsCount = await deployedContract.listedItemsCount();
//       assert.equal(listedItemsCount.toNumber(), 1, "listed items count is not 1");
//     });

//     it("should have created NFT items", async () => {
//       await deployedContract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//       const nftItem = await deployedContract.getNftItem(1);
//       assert.equal(nftItem.tokenId, 1, "token id not 1");
//       assert.equal(nftItem.price, nftPrice, "nft price is not correct");
//       assert.equal(nftItem.creator, accounts[0], "nft creator account is not matched");
//       assert.equal(nftItem.isListed, true, "NFT token is not listed yet");
//     });
//   });
// });














// const { assert } = require("console");
// const NftMarket = artifacts.require("NftMarket");

// contract("NftMarket", (accounts) => {
//   let _contract;

//   before(async () => {
//     _contract = await NftMarket.deployed();
//   });

//   describe("MintToken", () => {
//     const tokenURI = "https://nfttoken.com";
//     const nftPrice = web3.utils.toWei("5", "ether");
//     const listingPrice = web3.utils.toWei("0.5", "ether");

//     before(async () => {
//       await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//     });

//     it("owner first token address[0] is required", async () => {
//       const owner = await _contract.ownerOf(1);
//       assert.equal(owner, accounts[0], "owner address[0] is not matching");
//     });

//     it("first token should be point to the correct tokenURI", async () => {
//       const actualTokenURI = await _contract.tokenURI(1);
//       assert.equal(actualTokenURI, tokenURI, "tokenURI is not correctly set");
//     });

//     it("should not be possible to create a nft with used tokenRI", async () => {
//       try {
//         await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
//         assert.fail("Expected error but did not get one");
//       } catch (error) {
//         assert(error.toString().includes("tokenURI already exist"), "nft minted with previous URI");
//       }
//     });

//     it("should have only one listed items", async () => {
//       const listedItemsCount = await _contract.listedItemsCount();
//       assert.equal(listedItemsCount.toNumber(), 1, "listed items count is not 1");
//     });

//     it("should have created NFT items", async () => {
//       const nftItem = await _contract.getNftItem(1);
//       assert.equal(nftItem.tokenId, 1, "token id not 1");
//       assert.equal(nftItem.price, nftPrice, "nft price is not correct");
//       assert.equal(nftItem.creator, accounts[0], "nft creator account is not matched");
//       assert.equal(nftItem.isListed, true, "NFT token is not listed yet");
//     });
//   });
// });




















// const { assert } = require("console");

// const NftMarket = artifacts.require("NftMarket");

// contract ("NftMarket", (accounts) =>{
//     let _contract;

//     before(async () => {
//         _contract =await  NftMarket.deployed();
//     });
    
//     describe(" MintToken ", ()=>{
//       const tokenURI = "https://nfttoken.com";
//       const nftPrice = web3.utils.toWei("5", "ether");
//       const listingPrice = web3.utils.toWei("0.5", "ether");

//     })


//     before( async ()=>{
//       await _contract.mintToken(tokenURI, nftPrice, {
//         value: listingPrice,
//         from: accounts[0]
//       })

//       it("owner first token  address[0] is required", async ()=>{
//         const owner =await _contract.ownerOf(1);
//         assert.equal(owner, accounts[0], " owner address[0] is not matching ");
//       });

//       it("first token should be point to the correct tokenURI", async ()=>{
//         const actualTokenURI = await _contract.tokenURI(1);
//         assert.equal (actualTokenURI, tokenURI, " tokenURI is not correctly set");
//       })

//       it("should not be possible to create a nft with used tokenRI", async ()=>{
//         try {
//           await _contract.mintToken(tokenURI, nftPrice, {
//             value: listingPrice,
//             from: accounts[0]
//           });

//           assert.fail("Expected  error but did not get one")
//         } catch (error) {
//           assert(error.toString().include("tokenURI already exist"), "nft minted with previous URI");
//         }
//       })

//       it("should have only one listed items", async ()=>{
//         const listedItemsCount =await _contract.listedItemsCount();
//         assert.equal(listedItemsCount.toNumber(),1, "listed items count is not 1");
//       })

//       it("should have created NFT items", async () =>{
//         const nftItem = await _contract.getNftItem(1);

//         assert.equal(nftItem.tokenId, 1, "token id not 1");
//         assert.equal(nftItem.price, nftPrice, "nft price is not correct");
//         assert.equal(nftItem.creator, accounts[0], "nft creator account is not matched");
//         assert.equal(nftItem.isListed, isListed, "NFT token is not listed yet");

//       })




//     })

// })












// oldOne 































// const { assert } = require("console");

// const NftMarket = artifacts.require("NftMarket");

// contract ("NftMarket", (accounts) =>{
//     let _contract;

//     before(async () => {
//         _contract =await  NftMarket.deployed();
//     });

//     describe(" Mint token ", ()=>{
//       const tokenURI = "https://nfttoken.com";
//       const nftPrice = web3.utils.toWei("5", "ether");
//       const listingPrice = web3.utils.toWei("0.5", "ether");

//     })

//     before( async ()=>{
//       await _contract.mintToken(tokenURI, nftPrice, {
//         value: listingPrice,
//         from: accounts[0]
//       })

//       it("owner first token  address[0] is required", async ()=>{
//         const owner =await _contract.ownerOf(1);
//         assert.equal(owner, accounts[0], " owner address[0] is not matching ");
//       });

//       it("first token should be point to the correct tokenURI", async ()=>{
//         const actualTokenURI = await _contract.tokenURI(1);
//         assert.equal (actualTokenURI, tokenURI, " tokenURI is not correctly set");
//       })

//       it("should not be possible to create a nft with used tokenRI", async ()=>{
//         try {
//           await _contract.mintToken(tokenURI, nftPrice, {
//             value: listingPrice,
//             from: accounts[0]
//           });

//           assert.fail("Expected  error but did not get one")
//         } catch (error) {
//           assert(error.toString().include("tokenURI already exist"), "nft minted with previous URI");
//         }
//       })

//       it("should have only one listed items", async ()=>{
//         const listedItemsCount =await _contract.listedItemsCount();
//         assert.equal(listedItemsCount.toNumber(),1, "listed items count is not 1");
//       })

//       it("should have created NFT items", async () =>{
//         const nftItem = await _contract.getNftItem(1);

//         assert.equal(nftItem.tokenId, 1, "token id not 1");
//         assert.equal(nftItem.price, nftPrice, "nft price is not correct");
//         assert.equal(nftItem.creator, accounts[0], "nft creator account is not matched");
//         assert.equal(nftItem.isListed, isListed, "NFT token is not listed yet");

//       })




      

//       describe("Buy NFT", () => {
//         before(async () => {
//           await _contract.buyNft(1, {
//             from: accounts[1],
//             value: _nftPrice
//           })
//         })
    
//         it("should unlist the item", async () => {
//           const listedItem = await _contract.getNftItem(1);
//           assert.equal(listedItem.isListed, false, "Item is still listed");
//         })
    
//         it("should decrease listed items count", async () => {
//           const listedItemsCount = await _contract.listedItemsCount();
//           assert.equal(listedItemsCount.toNumber(), 0, "Count has not been decrement");
//         })
    
//         it("should change the owner", async () => {
//           const currentOwner = await _contract.ownerOf(1);
//           assert.equal(currentOwner, accounts[1], "Item is still listed");
//         })
//       })


//     })

// })








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













