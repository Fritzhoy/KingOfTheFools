// SPDX-License-Identifier: Apache-2.0

pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FakeUsdc is ERC20{
  constructor() ERC20("USDC", "FoolUSDC") {
    
  }

  function faucet(address to, uint amount) external {
    _mint(to, amount);
  }
}