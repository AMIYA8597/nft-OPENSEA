// pragma solidity <=0.8.22;

// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";



// contract NftMarket is ERC721URIStorage {

//   uint256 private _listedItems;
//   uint256 private _tokenIds;

//   constructor() ERC721("CreatureNFT", "CNFT") {}

//   function mintToken(string memory tokenURI) public payable returns (uint256) {
//     _tokenIds++;
//     _listedItems++;

//     uint256 newTokenId = _tokenIds;

//     _safeMint(msg.sender, newTokenId); 
//     _setTokenURI(newTokenId, tokenURI);

//     return newTokenId;
//   }
// }













// SPDX-License-Identifier: MIT

// pragma solidity ^0.8.19;
pragma solidity <=0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// import "@openzeppelin/contracts/utils/Strings.sol";

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
    uint256 private _tokenIdsCount;

    mapping(string => bool) private _usedTokenURIs;
    mapping(uint256 => NftItem) private _idToNftItem;

    event NftItemCreated(
        uint256 tokenId,
        uint256 price,
        address creator,
        bool isListed
    );

    constructor() ERC721("CreaturesNFT", "CNFT") {}

    function getNftItem(uint256 tokenId) public view returns (NftItem memory) {
        return _idToNftItem[tokenId];
    }

    function listedItemsCount() public view returns (uint256) {
        return _listedItemsCount;
    }

    function tokenURIExists(string memory tokenURI) public view returns (bool) {
        return _usedTokenURIs[tokenURI];
    }

    function mintToken(string memory tokenURI, uint256 price) public payable returns (uint256) {
        require(!tokenURIExists(tokenURI), "Token URI already exists");
        require(msg.value == listingPrice, "Price must be equal to listing price");

        _tokenIdsCount++;
        _listedItemsCount++;

        uint256 newTokenId = _tokenIdsCount;

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _createNftItem(newTokenId, price);
        _usedTokenURIs[tokenURI] = true;

        return newTokenId;
    }

    function _createNftItem(uint256 tokenId, uint256 price) private {
        require(price > 0, "Price must be at least 1 wei");

        _idToNftItem[tokenId] = NftItem(tokenId, price, msg.sender, true);

        emit NftItemCreated(tokenId, price, msg.sender, true);
    }
}

























// pragma solidity <=0.8.22;

// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
// // import "@openzeppelin/contracts/utils/Counters.sol";
// // import "@openzeppelin/contracts/utils/Counters.sol";


// contract NftMarket is ERC721URIStorage {
// //   using Counters for Counters.Counter;

// //   Counters.Counter private _listedItems;
// //   Counters.Counter private _tokenIds;

//   uint256 private _listedItems;
//   uint256 private _tokenIds;

//   constructor() ERC721("CreatureNFT", "CNFT") {}

//   function mintToken(string memory tokenURI) public payable returns (uint256) {
//     // _tokenIds.increment();
//     // _listedItems.increment();
//     _tokenIds++;
//     _listedItems++;

//     // uint256 newTokenId = _tokenIds.current();
//     uint256 newTokenId = _tokenIds;

//     _safeMint(msg.sender, newTokenId); 
//     _setTokenURI(newTokenId, tokenURI);

//     return newTokenId;
//   }
// }



















// pragma solidity >=0.5.0 <0.9.0;

// import "openZeppelin/contracts/token/ERC721/extension/ERC721URIStorage.sol";
// import "openZeppelin/contracts/utils/Counters.sol";

// contract NftMarket is ERC721URIStorage {
// using Counters for Counters.counter;

// Counters.counter private _listedItems;
// Counters.counter private _tokenIds;

// constructor()ERC721("CreatureNFT", "CNFT") {}


// function mintToken(string memory tokenURI) public payable returns (unit) {
//     _tokenIds.increment();
//     _listedItems.increment();
//     unit newTokenId = _tokenIds.current();

//     safeMint(msg.sender, newTokenId);
//     _setTokenURI(newTokenId, tokenURI);
//     return newTokenId;
// }
// }









