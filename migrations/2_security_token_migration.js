const SecurityToken = artifacts.require("SecurityToken");

module.exports = function(deployer) {
  deployer.deploy(SecurityToken);
};
