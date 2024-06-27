// SPDX-License-Identifier: MIT
pragma solidity <=0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NftMarket is ERC721URIStorage {
    using Strings for uint256;

    struct NftItem {
        uint256 tokenId;
        uint256 price;
        address creator;
        bool isListed;
    }


    uint256 public listingPrice = 0.025 ether;
    uint256 private _listedItemsCount;
    uint256 private _tokenIds;
    uint256[] private _allNfts;

    mapping(string => bool) private _usedTokenURIs;
    mapping(uint256 => NftItem) private _idNftItem;
    mapping(uint256 => uint256) private _idToNftIndex;
    mapping(address => mapping(uint256 => uint256)) private _ownedTokens;
    mapping(uint256 => uint256) private _idToOwnedIndex;

    event NftItemCreated(
        uint256 tokenId,
        uint256 price,
        address creator,
        bool isListed
    );

    constructor() ERC721("CreatureNFT", "CNFT") {}

    function setListingPrice(uint256 newPrice) external {
        require(newPrice > 0, "Price must be at least 1 wei");
        listingPrice = newPrice;
    }

    function getNftItem(uint256 tokenId) public view returns (NftItem memory) {
        return _idNftItem[tokenId];
    }

    function listedItemsCount() public view returns (uint256) {
        return _listedItemsCount;
    }

    function tokenURIExists(string memory tokenURI) public view returns (bool) {
        return _usedTokenURIs[tokenURI];
    }

    function mintToken(string memory tokenURI, uint256 price) public payable returns (uint256) {
        require(!_usedTokenURIs[tokenURI], "Token URI already exists");
        require(msg.value == listingPrice, "Price must be equal to listing price");

        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _createNftItem(newTokenId, price);
        _usedTokenURIs[tokenURI] = true;

        _listedItemsCount++;

        return newTokenId;
    }

    function _createNftItem(uint256 tokenId, uint256 price) private {
        require(price > 0, "Price must be at least 1 wei");
        _idNftItem[tokenId] = NftItem(tokenId, price, msg.sender, true);
        emit NftItemCreated(tokenId, price, msg.sender, true);
    }

    // function nftCreatedOne(address nft, uint number, string memory name) public pure {
    //     require(number > 11, "number must be greater than 11");
    // }
 
    function resetListedItemsCount() public {
        _listedItemsCount = 0;
    }

    function totalSupply() public view returns (uint256) {
        return _allNfts.length;
    }

    function tokenByIndex(uint256 index) public view returns (uint256) {
        require(index < totalSupply(), "Index out of bounds");
        return _allNfts[index];
    }

    // NEW FUNCTION TO BUY AN NFT 

         function buyNft(uint256 tokenId) public payable {
        NftItem storage item = _idNftItem[tokenId];
        uint256 price = item.price;
        address owner = ownerOf(tokenId);

        require(owner != msg.sender, "You already own this NFT");
        require(msg.value == price, "Please submit the asking price");

        item.isListed = false;
        _listedItemsCount--;

        _transfer(owner, msg.sender, tokenId);
        payable(owner).transfer(msg.value);
    }

    function _beforeTokenTransfer( address from, address to, uint256 tokenId, uint256 batchSize) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
        // if (batchSize > 1) {
        //     revert("ERC721Enumerable: consecutive transfers not supported");
        // }
        if (from == address(0)) {
            _addTokenToAllTokensEnumeration(tokenId);
        } 
        
        // else if (from != to) {
        //     _removeTokenFromOwnerEnumeration(from, tokenId);
        // }
        // if (to == address(0)) {
        //     _removeTokenFromAllTokensEnumeration(tokenId);
        // } else if (to != from) {
        //     _addTokenToOwnerEnumeration(to, tokenId);
        // }
    }

      function _addTokenToAllTokensEnumeration(uint256 tokenId) private {
        _idToNftIndex[tokenId] = _allNfts.length;
        _allNfts.push(tokenId);
    }



    //   NEW PART

    function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256) {
        require(index < ERC721.balanceOf(owner), "Index out of bounds");
        return _ownedTokens[owner][index];
    }

    function getAllNftsOnSale() public view returns (NftItem[] memory) {
        uint256 allItemsCount = totalSupply();
        uint256 currentIndex = 0;
        NftItem[] memory items = new NftItem[](_listedItemsCount);

        for (uint256 i = 0; i < allItemsCount; i++) {
            uint256 tokenId = tokenByIndex(i);
            NftItem storage item = _idNftItem[tokenId];

            if (item.isListed) {
                items[currentIndex] = item;
                currentIndex += 1;
            }
        }

        return items;
    }

    function getOwnedNfts() public view returns (NftItem[] memory) {
        uint256 ownedItemsCount = ERC721.balanceOf(msg.sender);
        NftItem[] memory items = new NftItem[](ownedItemsCount);

        for (uint256 i = 0; i < ownedItemsCount; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(msg.sender, i);
            NftItem storage item = _idNftItem[tokenId];
            items[i] = item;
        }

        return items;
    }

    function placeNftOnSale(uint256 tokenId, uint256 newPrice) public payable {
        require(ownerOf(tokenId) == msg.sender, "You are not the owner of this NFT");
        require(!_idNftItem[tokenId].isListed, "Item is already on sale");
        require(msg.value == listingPrice, "Price must be equal to listing price");

        _idNftItem[tokenId].isListed = true;
        _idNftItem[tokenId].price = newPrice;
        _listedItemsCount++;
    }

    function _addTokenToOwnerEnumeration(address to, uint256 tokenId) private {
        uint256 length = ERC721.balanceOf(to);
        _ownedTokens[to][length] = tokenId;
        _idToOwnedIndex[tokenId] = length;
    }

    function _removeTokenFromOwnerEnumeration(address from, uint256 tokenId) private {
        uint256 lastTokenIndex = ERC721.balanceOf(from) - 1;
        uint256 tokenIndex = _idToOwnedIndex[tokenId];

        if (tokenIndex != lastTokenIndex) {
            uint256 lastTokenId = _ownedTokens[from][lastTokenIndex];

            _ownedTokens[from][tokenIndex] = lastTokenId;
            _idToOwnedIndex[lastTokenId] = tokenIndex;
        }

        delete _idToOwnedIndex[tokenId];
        delete _ownedTokens[from][lastTokenIndex];
    }

    function _removeTokenFromAllTokensEnumeration(uint256 tokenId) private {
        uint256 lastTokenIndex = _allNfts.length - 1;
        uint256 tokenIndex = _idToNftIndex[tokenId];
        uint256 lastTokenId = _allNfts[lastTokenIndex];

        _allNfts[tokenIndex] = lastTokenId;
        _idToNftIndex[lastTokenId] = tokenIndex;

        delete _idToNftIndex[tokenId];
        _allNfts.pop();
    }

}