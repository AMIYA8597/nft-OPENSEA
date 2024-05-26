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
    mapping(uint256 =>uint256) private _idToNftIndex;

    event NftItemCreated(
        uint256 tokenId,
        uint256 price,
        address creator,
        bool isListed
    );

    constructor() ERC721("CreatureNFT", "CNFT") {}

    function getNftItem(uint256 tokenId) public view returns (NftItem memory) {
        return _idNftItem[tokenId];
    }

    function listedItemsCount() public view returns (uint256) {
        return _listedItemsCount;
    }

    function tokenURIExists(string memory tokenURI) public view returns (bool) {
        return _usedTokenURIs[tokenURI];
    }

function mintToken(string memory tokenURI, uint256 price)
    public
    payable
    returns (uint256)
{
    require(!_usedTokenURIs[tokenURI], "Token URI already exists");
    // require(msg.value == listingPrice, "Price must be equal to listing price");

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


    // New function to reset _listedItemsCount
    function resetListedItemsCount() public {
        _listedItemsCount = 0;
    }

    function totalSupply() public view returns (uint256) {
        return _allNfts.length;
    }

    function tokenByIndex(uint256 index) public view returns(uint256) {
        require(index < totalSupply(), "index out of bounds");
        return _allNfts[index];
    }

  // new Function to buy an NFT
    function buyNft (uint256 tokenId) public payable {
        NftItem storage item = _idNftItem[tokenId];
        uint256 price = item.price;
        address owner = ownerOf(tokenId);

        require(owner != msg.sender, "you already own this NFT");
        require(msg.value == price , "please submit the asking Price");

        item.isListed = false;
        _listedItemsCount-- ;
        _transfer(owner, msg.sender, tokenId);
        payable(owner).transfer(msg.value);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal virtual override {
         super._beforeTokenTransfer(from, to, tokenId);

                     //Mint Token
            if (from == address(0)) {
                addTokenToAllTokenEnmeration(tokenId);
            }
    }

    function addTokenToAllTokenEnmeration(uint tokenId) private {
        _idToNftIndex[tokenId] =  _allNfts.length;
        _allNfts.push(tokenId);
    }

}














































// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// contract NftMarket is ERC721URIStorage {
//     using Strings for uint256;

//     struct NftItem {
//         uint256 tokenId;
//         uint256 price;
//         address creator;
//         bool isListed;
//     }

//     uint256 private _listedItemsCount;
//     uint256 private _tokenIds;
//     uint256[] private _allNfts;
//     uint256 public listingPrice = 0.025 ether;

//     mapping(string => bool) private _usedTokenURIs;
//     mapping(uint256 => NftItem) private _idNftItem;
//     mapping(uint256 => uint256) private _idToNftIndex;

//     event NftItemCreated(
//         uint256 tokenId,
//         uint256 price,
//         address creator,
//         bool isListed
//     );

//     constructor() ERC721("CreatureNFT", "CNFT") {}

//     function getNftItem(uint256 tokenId) public view returns (NftItem memory) {
//         return _idNftItem[tokenId];
//     }

//     function listedItemsCount() public view returns (uint256) {
//         return _listedItemsCount;
//     }

//     function tokenURIExists(string memory tokenURI)
//         public
//         view
//         returns (bool)
//     {
//         return _usedTokenURIs[tokenURI];
//     }

//     function totalSupply() public view returns (uint256) {
//         return _allNfts.length;
//     }

//     function tokenByIndex(uint256 index) public view returns (uint256) {
//         require(index < totalSupply(), "Index out of bounds");
//         return _allNfts[index];
//     }

//     function mintToken(string memory tokenURI, uint256 price)
//         public
//         payable
//         returns (uint256)
//     {
//         require(!_usedTokenURIs[tokenURI], "Token URI already exists");
//         require(msg.value == listingPrice, "Price must be equal to listing price");

//         _tokenIds++;
//         uint256 newTokenId = _tokenIds;

//         _safeMint(msg.sender, newTokenId);
//         _setTokenURI(newTokenId, tokenURI);
//         _createNftItem(newTokenId, price);
//         _usedTokenURIs[tokenURI] = true;

//         _listedItemsCount++;

//         return newTokenId;
//     }

//     function buyNft(uint256 tokenId) public payable {
//         NftItem storage item = _idNftItem[tokenId];
//         uint256 price = item.price;
//         address owner = ownerOf(tokenId);
//         require(owner != msg.sender, "You already own this NFT");
//         require(msg.value == price, "Please submit the asking price");

//         item.isListed = false;
//         _listedItemsCount--;
//         _transfer(owner, msg.sender, tokenId);
//         payable(owner).transfer(msg.value);
//     }

//     function _createNftItem(uint256 tokenId, uint256 price) private {
//         require(price > 0, "Price must be at least 1 wei");
//         _idNftItem[tokenId] = NftItem(tokenId, price, msg.sender, true);
//         emit NftItemCreated(tokenId, price, msg.sender, true);
//     }

//     function resetListedItemsCount() public {
//         _listedItemsCount = 0;
//     }

//     function _beforeTokenTransfer(
//         address from,
//         address to,
//         uint256 tokenId
//     ) internal virtual override {
//         super._beforeTokenTransfer(from, to, tokenId);

//         // minting token
//         if (from == address(0)) {
//             _addTokenToAllTokensEnumeration(tokenId);
//         }
//     }

//     function _addTokenToAllTokensEnumeration(uint256 tokenId) private {
//         _idToNftIndex[tokenId] = _allNfts.length;
//         _allNfts.push(tokenId);
//     }
// }




