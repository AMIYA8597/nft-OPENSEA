const assert = require('assert');
const NftMarket = artifacts.require("NftMarket");

contract("NftMarket", (accounts) => {
    let _contract;
    const nftPrice = web3.utils.toWei("5", "ether");
    const listingPrice = web3.utils.toWei("0.025", "ether");

    before(async () => {
        _contract = await NftMarket.new();
        // Setting the listing price to ensure consistency
        await _contract.setListingPrice(listingPrice);
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

    describe("Token Transfer", () => {
        const tokenURI1 = "https://ourminitingToken1.com";
        const tokenURI2 = "https://ourmintingToken2.com";

        before(async () => {
            await _contract.mintToken(tokenURI1, nftPrice, { from: accounts[0], value: listingPrice });
            await _contract.mintToken(tokenURI2, nftPrice, { from: accounts[0], value: listingPrice });
        });

        it("should set new listing price", async () => {
            const newListingPrice = web3.utils.toWei("0.05", "ether");
            await _contract.setListingPrice(newListingPrice, { from: accounts[0] });
            const retrievedListingPrice = await _contract.listingPrice();
            assert.equal(retrievedListingPrice.toString(), newListingPrice, "Invalid Price");
        });

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
    });

    
    // NEW PART

    // describe("Token transfer to new owner", () => {
    //     const tokenURI = "https://nfttoken.com/9";
    
    //     before(async () => {
    //         await _contract.mintToken(tokenURI, nftPrice, { value: listingPrice, from: accounts[0] });
    //         await _contract.approve(accounts[0], 3, { from: accounts[0] }); // Approve accounts[0] to transfer token 3
    //         await _contract.transferFrom(accounts[0], accounts[2], 3, { from: accounts[0] });
    //     });
    
    //     it("accounts[2] should own 1 token", async () => {
    //         const balance = await _contract.balanceOf(accounts[2]);
    //         assert.equal(balance.toNumber(), 1, "accounts[2] does not own the transferred token");
    //     });
    // });
    
    // describe("List an Nft", () => {
    //     const tokenURI = "https://test-json-4.com";
    
    //     before(async () => {
    //         await _contract.mintToken(tokenURI, nftPrice, { from: accounts[0], value: listingPrice });
    //         await _contract.setListingPrice(listingPrice, { from: accounts[0] }); // Set listing price before listing
    //         await _contract.placeNftOnSale(4, nftPrice, { from: accounts[0], value: listingPrice });
    //     });
    
    //     it("should have one listed item", async () => {
    //         const listedNfts = await _contract.getAllNftsOnSale();
    //         assert.equal(listedNfts.length, 1, "Invalid length of Nfts");
    //         assert.equal(listedNfts[0].tokenId, 4, "Incorrect token ID");
    //     });
    // });
    
});
