// SPDX-License-Identifier: Apache-2.0

pragma solidity 0.8.17;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract KingOfTheFools {
    //byte32ETH =0xaaaebeba3810b1e6b70781f14b2d72c1cb89c0b2b320c43bb67ff79f562f5ff4
    //byte32 USDC = 0xd6aca1be9729c13d677335161321649cccae6a591554772516700f986f942eaa
    //address public _USDC = 0x41e1b3476FB2b5EB3dC22Ed90213d90538c42500;
    //address public _ETH = 0x94e5eb5B67e41b285dC551B902f362fA2D394f37;
    uint256 public totalBalance;
    address[] public users;

    struct Deposit {
        uint256 id;
        uint256 amount;
        address user;
        bytes32 symbol;
    }

    mapping(bytes32 => address) public tokens;
    bytes32[] public tokenList;
    address public owner;
    //tracks how many tokens were send by each address
    Deposit[] public deposits;

    event NewKingOfTheFools(
        address winner,
        bytes32 token,
        uint256 amount,
        bool deposited,
        uint256 transactionId
    );

    event NewDeposit(
        bytes32 token,
        uint256 amount,
        bool deposited,
        uint256 transactionId
    );

    constructor() {
        owner = msg.sender;
    }

    modifier tokenAccepted(bytes32 symbol) {
        require(tokens[symbol] != address(0), "Token is not accepted");
        _;
    }

    function addToken(bytes32 symbol, address tokenAddress) external {
        require(msg.sender == owner, "Only Owner of the Contract");
        tokens[symbol] = tokenAddress;
        tokenList.push(symbol);
    }

    function checkPreviousAmount() internal view returns (uint256){

       uint256 prevAmount = deposits[deposits.length - 1].amount;
       prevAmount = (prevAmount * 3)/2;
       return prevAmount;
    }

    function deposit(uint256 _amount, bytes32 _symbol)
        external
        tokenAccepted(_symbol) returns (bool){
    
        if(deposits.length == 0 || _amount > checkPreviousAmount()) 
        {
            IERC20(tokens[_symbol]).transferFrom(
                msg.sender,
                address(this),
                _amount
            );
            deposits.push(
                Deposit(deposits.length, _amount, msg.sender, _symbol)
            );
            totalBalance += _amount;

            emit NewDeposit(_symbol, _amount, true, deposits.length);
            return true;

        } else {
            
            IERC20(tokens[_symbol]).transferFrom(
                msg.sender,
                deposits[deposits.length - 1].user,
                _amount
            );
            deposits.push(
                Deposit(deposits.length, _amount, msg.sender, _symbol)
            );
            emit NewKingOfTheFools(
                deposits[deposits.length - 2].user,
                _symbol,
                _amount,
                false,
                deposits.length
            );
            return false;
        }
    }
}
