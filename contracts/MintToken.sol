pragma solidity >=0.5.0 <0.9.0;

import "openZeppelin/contracts/token/ERC721/extension/ERC721URIStorage.sol";
import "openZeppelin/contracts/utils/Counters.sol";

contract NftMarket is ERC721URIStorage {
using Counters for Counters.counter'

Counters.counter private _listedItems;
Counters.counter private _tokenIds;

constructor()ERC721("CreatureNFT", "CNFT") {}

function mintToken(string memory tokenURI) public payable returns (unit) {
    _tokenIds.increment();
    _listedItems.increment();
    unit newTokenId = _tokenIds.current();

    safeMint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, tokenURI);
    return newTokenId;
}
}