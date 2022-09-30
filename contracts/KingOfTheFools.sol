// SPDX-License-Identifier: Apache-2.0

pragma solidity 0.8.17;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

/// @title King Of Fools - Homework for Interview matters
/// @author Camila Marques
/// @notice You can deposit ETH or USDC into a smart contract, as long as it's
/// at least 1.5x more money than the previous person. If
/// you do that, you become "King of the fools",
/// and your money gets sent back to the previous person.
/// mock tokens were create in order to test function behaviour.
/// @custom:experimental This is an experimental contract.

contract KingOfTheFools {

    /// byte32ETH = 0xaaaebeba3810b1e6b70781f14b2d72c1cb89c0b2b320c43bb67ff79f562f5ff4
    /// byte32USDC = 0xd6aca1be9729c13d677335161321649cccae6a591554772516700f986f942eaa
    /// Fake Tokens Mocks contract
    /// #address USDC = 0x41e1b3476FB2b5EB3dC22Ed90213d90538c42500;
    /// #address public _ETH = 0x94e5eb5B67e41b285dC551B902f362fA2D394f37;

    uint256 public totalBalance;
    address public owner;
    struct Deposit {
        uint256 amount;
        address user;
        bytes32 symbol;
        bool deposited;
    }
    Deposit[] public deposits;
    mapping(bytes32 => address) public tokens;
    mapping(address => Deposit) fundsWinner;

    event NewDeposit(address from, bytes32 token, uint256 amount, bool deposited);

    event NewKingOfTheFools(
        address winner,
        bytes32 token,
        uint256 amount,
        bool deposited
    );

    modifier tokenAccepted(bytes32 symbol) {
        require(tokens[symbol] != address(0), "Token is not accepted");
        _;
    }

    modifier onlyWinner(address winner){
    
    require(fundsWinner[msg.sender].deposited == true, "No rewards to this address" );
    _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addToken(bytes32 symbol, address tokenAddress) external {
        require(msg.sender == owner, "Only Owner of the Contract");
        tokens[symbol] = tokenAddress;
    }

    /// @notice Deposit function have a condition, 
    /// if the amount is > 1.5 * previousAmount than deposit in the contract,
    /// otherwise should transfer the amount deposit to the previous address.
    /// @dev function should accept only USDC and ETH (or anyother tokens that 
    /// the owner add to the list by addToken function

    function deposit(uint256 _amount, bytes32 _symbol)
        external
        tokenAccepted(_symbol)
    {   require(_amount > 0, "should send more than zero tokens");
        if (deposits.length == 0 || _amount > checkPreviousAmount()) {
            
            totalBalance += _amount;

            depositToContract(msg.sender, _amount, _symbol);

            emit NewDeposit(msg.sender, _symbol, _amount, true);
          
        } else {

            address winnerAddress = deposits[deposits.length - 1].user;
            
            depositToContract(msg.sender, _amount, _symbol);
            
            fundsWinner[winnerAddress] = deposits[deposits.length - 1];
           
            emit NewKingOfTheFools(
                winnerAddress,
                _symbol,
                _amount,
                false
            );
        }
    }

    function withdrawReward() external onlyWinner(msg.sender) {
        withdraw(msg.sender);
    }

    function withdraw(address _to) internal {

        uint rewardAmount = fundsWinner[_to].amount;
        bytes32 _symbol = fundsWinner[_to].symbol;
        fundsWinner[_to].amount = 0;
        IERC20(tokens[_symbol]).transfer(_to, rewardAmount);

    }

    function depositToContract(address from, uint256 _amount, bytes32 _symbol) internal  {

        IERC20(tokens[_symbol]).transferFrom(
                from,
                address(this),
                _amount
        );

        deposits.push(Deposit(_amount, from, _symbol, true));
    }

    /// @notice Returns the previous value deposited multipled for 1.5
    /// @dev    Used fraction since solidity will not understand 1.5
    /// @return previous price multiplied by 1.5

    function checkPreviousAmount() internal view returns (uint256) {
        uint256 prevAmount = deposits[deposits.length - 1].amount;
        prevAmount = (prevAmount * 3) / 2;
        return prevAmount;
    }

}
