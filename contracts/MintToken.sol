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

uint256 private _listedItemsCount;
uint256 private _tokenIds;

  uint256 private _listedItems;
  uint256 private _tokenIdsCount;

  mapping(string =>bool) private _usedTokenURIs;
  mapping(uint256 => NftItem) private _idNftItem;

  event NftItemCreated (
        uint256 tokenId,
        uint256 price,
        address creator,
        bool isListed
  );

  constructor() ERC721("CreatureNFT", "CNFT") {}

  function getNftItem(uint256 tokenId) public view returns (NftItem memory){
    return _idNftItem[tokenId];
  }

  function listedItemsCount() public view returns (uint256) {
    return _listedItemsCount;
  }

  function tokenURIExists (string memory tokenURI) public view returns (bool) {
    return _usedTokenURIs[tokenURI];

  }

  function mintToken(string memory tokenURI, uint256 price) public payable returns (uint256) {
    
    _tokenIds++;
    _listedItems++;

    uint256 newTokenId = _tokenIdsCount;

    _safeMint(msg.sender, newTokenId); 
    _setTokenURI(newTokenId, tokenURI);
    _createNftItem(newTokenId, price);
    _usedTokenURIs[tokenURI] = true;

    return newTokenId;
  }

  function _createNftItem (uint256 tokenId, uint256 price) private {
    require(price >0, "Price atleast 100 wei ");
    _idNftItem[tokenId] = NftItem(tokenId, price, msg.sender,true);
    emit NftItemCreated ( tokenId, price, msg.sender, true);

  }
}










