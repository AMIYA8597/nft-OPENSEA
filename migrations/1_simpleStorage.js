var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var SecondStorage = artifacts.require("./SecondStorage.sol");

module.exports = function (deployer) {
    deployer.deploy(SimpleStorage);
    deployer.deploy(SecondStorage);
}














// var assert = require('assert');
// contract('SimpleStorage', function(accounts) {
//   it("should store the value 89", function() {
//     return SimpleStorage.deployed().then(function(instance) {
//       return instance.set("89", {from: accounts[0]});
//     }).then(function(result) {
//       assert.equal(result.logs[0].args._value, "89");
//       return SimpleStorage.deployed();
//     }).then(function(instance) {
//       return instance.get.call();
//     }).then(function(value) {
//       assert.equal(value.toNumber(), 89);
//     });
//   });