pragma solidity <=0.8.22;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";



contract NftMarket is ERC721URIStorage {

  uint256 private _listedItems;
  uint256 private _tokenIds;

  constructor() ERC721("CreatureNFT", "CNFT") {}

  function mintToken(string memory tokenURI) public payable returns (uint256) {
    _tokenIds++;
    _listedItems++;

    uint256 newTokenId = _tokenIds;

    _safeMint(msg.sender, newTokenId); 
    _setTokenURI(newTokenId, tokenURI);

    return newTokenId;
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









