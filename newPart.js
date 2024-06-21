Sure, let's break down the code line by line to understand each part.

### `tokenOfOwnerByIndex`

```solidity
function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256) {
    require(index < ERC721.balanceOf(owner), "Index out of bounds");
    return _ownedTokens[owner][index];
}
```

- **Purpose**: This function returns the token ID owned by a specific address (`owner`) at a given index.
- **Details**:
  - `require(index < ERC721.balanceOf(owner), "Index out of bounds");`
    - Checks if the provided index is less than the total number of tokens owned by the address. If not, it reverts the transaction with the message "Index out of bounds".
  - `return _ownedTokens[owner][index];`
    - Returns the token ID at the specified index for the given owner.

### `getAllNftsOnSale`

```solidity
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
```

- **Purpose**: This function returns all NFTs that are currently listed for sale.
- **Details**:
  - `uint256 allItemsCount = totalSupply();`
    - Retrieves the total number of NFTs in the contract.
  - `uint256 currentIndex = 0;`
    - Initializes an index counter for the array of listed items.
  - `NftItem[] memory items = new NftItem[](_listedItemsCount);`
    - Creates an array to hold the listed items, sized according to `_listedItemsCount`.
  - `for (uint256 i = 0; i < allItemsCount; i++) { ... }`
    - Iterates through all NFTs.
  - `uint256 tokenId = tokenByIndex(i);`
    - Retrieves the token ID at the current index.
  - `NftItem storage item = _idNftItem[tokenId];`
    - Retrieves the NFT item struct corresponding to the token ID.
  - `if (item.isListed) { ... }`
    - Checks if the item is listed for sale.
  - `items[currentIndex] = item;`
    - Adds the item to the `items` array.
  - `currentIndex += 1;`
    - Increments the index counter.
  - `return items;`
    - Returns the array of listed items.

### `getOwnedNfts`

```solidity
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
```

- **Purpose**: This function returns all NFTs owned by the caller (`msg.sender`).
- **Details**:
  - `uint256 ownedItemsCount = ERC721.balanceOf(msg.sender);`
    - Retrieves the total number of NFTs owned by the caller.
  - `NftItem[] memory items = new NftItem[](ownedItemsCount);`
    - Creates an array to hold the owned items.
  - `for (uint256 i = 0; i < ownedItemsCount; i++) { ... }`
    - Iterates

through all NFTs owned by the caller.
  - `uint256 tokenId = tokenOfOwnerByIndex(msg.sender, i);`
    - Retrieves the token ID at the current index for the caller.
  - `NftItem storage item = _idNftItem[tokenId];`
    - Retrieves the NFT item struct corresponding to the token ID.
  - `items[i] = item;`
    - Adds the item to the `items` array.
  - `return items;`
    - Returns the array of owned items.

### `placeNftOnSale`

```solidity
function placeNftOnSale(uint256 tokenId, uint256 newPrice) public payable {
    require(ownerOf(tokenId) == msg.sender, "You are not the owner of this NFT");
    require(!_idNftItem[tokenId].isListed, "Item is already on sale");
    require(msg.value == listingPrice, "Price must be equal to listing price");
    _idNftItem[tokenId].isListed = true;
    _idNftItem[tokenId].price = newPrice;
    _listedItemsCount++;
}
```

- **Purpose**: This function allows the owner of an NFT to list it for sale.
- **Details**:
  - `require(ownerOf(tokenId) == msg.sender, "You are not the owner of this NFT");`
    - Ensures that the caller is the owner of the NFT.
  - `require(!_idNftItem[tokenId].isListed, "Item is already on sale");`
    - Ensures that the NFT is not already listed for sale.
  - `require(msg.value == listingPrice, "Price must be equal to listing price");`
    - Ensures that the caller has sent the correct listing price.
  - `_idNftItem[tokenId].isListed = true;`
    - Marks the NFT as listed.
  - `_idNftItem[tokenId].price = newPrice;`
    - Sets the new price for the NFT.
  - `_listedItemsCount++;`
    - Increments the count of listed items.

### `_addTokenToOwnerEnumeration`

```solidity
function _addTokenToOwnerEnumeration(address to, uint256 tokenId) private {
    uint256 length = ERC721.balanceOf(to);
    _ownedTokens[to][length] = tokenId;
    _idToOwnedIndex[tokenId] = length;
}
```

- **Purpose**: This function adds a token to the enumeration of tokens owned by an address.
- **Details**:
  - `uint256 length = ERC721.balanceOf(to);`
    - Retrieves the total number of tokens owned by the address.
  - `_ownedTokens[to][length] = tokenId;`
    - Adds the token ID to the `_ownedTokens` mapping at the appropriate index.
  - `_idToOwnedIndex[tokenId] = length;`
    - Maps the token ID to its index in the `_ownedTokens` mapping.

### `_removeTokenFromOwnerEnumeration`

```solidity
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
```

- **Purpose**: This function removes a token from the enumeration of tokens owned by an address.
- **Details**:
  - `uint256 lastTokenIndex = ERC721.balanceOf(from) - 1;`
    - Retrieves the index of the last token owned by the address.
  - `uint256 tokenIndex = _idToOwnedIndex[tokenId];`
    - Retrieves the index of the token to be removed.
  - `if (tokenIndex != lastTokenIndex) { ... }`
    - If the token to be removed is not the last token in the list:
    - `uint256 lastTokenId = _ownedTokens[from][lastTokenIndex];`
      - Retrieves the last token ID.
    - `_ownedTokens[from][tokenIndex] = lastTokenId;`
      - Moves the last token to the position of the token to be removed.
    - `_idToOwnedIndex[lastTokenId] = tokenIndex;`
      - Updates the index of the last token.
  - `delete _idToOwnedIndex[tokenId];`
    - Deletes the mapping for the removed token.
  - `delete _ownedTokens[from][lastTokenIndex];`
    - Deletes the last token entry.

### `_removeTokenFromAllTokensEnumeration`

```solidity
function _removeTokenFromAllTokensEnumeration(uint256 tokenId) private {
    uint256 lastTokenIndex = _allNfts.length - 1;
    uint256 tokenIndex = _idToNftIndex[tokenId];
    uint256 lastTokenId = _allNfts[lastTokenIndex];
    _allNfts[tokenIndex] = lastTokenId;
    _idToNftIndex[lastTokenId] = tokenIndex;
    delete _idToNftIndex[tokenId];
    _allNfts.pop();
}
```

- **Purpose**: This function removes a token from the enumeration of all tokens.
- **Details**:
  - `uint256 lastTokenIndex = _allNfts.length - 1;`
    - Retrieves the index of the last token in the list.
  - `uint256 tokenIndex = _idToNftIndex[tokenId];`
    - Retrieves the index of the token to be removed.
  - `uint256 lastTokenId = _allNfts[lastTokenIndex];`
    - Retrieves the last token ID.
  - `_allNfts[tokenIndex] = lastTokenId;`
    - Moves the last token to the position of the token to be removed.
  - `_idToNftIndex[lastTokenId] = tokenIndex;`
    - Updates the index of the last token.
  - `delete _idToNftIndex[tokenId];`
    - Deletes the mapping for the removed token.
  - `_allNfts.pop();`
    - Removes the last token from the `_allNfts` array.

### Summary

The provided code includes functions for managing and querying NFTs within the smart contract. The functions cover:
- Retrieving tokens owned by an address (`tokenOfOwnerByIndex`).
- Getting all NFTs currently listed for sale (`getAllNftsOnSale`).
- Getting all NFTs owned by the caller (`getOwnedNfts`).
- Placing an NFT on sale (`placeNftOnSale`).
- Internal functions for managing the enumeration of tokens (`_addTokenToOwnerEnumeration`, `_removeTokenFromOwnerEnumeration`, and `_removeTokenFromAllTokensEnumeration`).

These functions ensure the correct management and querying of NFTs within the contract, supporting a marketplace where NFTs can be listed, queried, and owned.