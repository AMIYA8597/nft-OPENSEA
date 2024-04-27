// SPDX-License-Identifier: MIT
pragma solidity <=0.8.19;
// pragma solidity <=0.8.22;

contract SimpleStorage{
    uint256 a;

    function setter(uint256 _a) public {
        a= _a+20;
    }
    // view --> normal --> pure 
    function getter() public view returns(uint256){
        // uint256 _a = a;
        return a*20;
    }
}
