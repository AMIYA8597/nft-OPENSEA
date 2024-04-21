
const NftMarket = artifacts.require("NftMarket");

contract ("NftMarket", (accounts) =>{
    let _contract = null;

    before(async () => {
        if(!deployedAddress) {
            console.error("Please provide the deployed Nft Market contract address");
            process.exit(1)
        }
        _contract =await  NftMarket.at(deployedAddress)
    })
})