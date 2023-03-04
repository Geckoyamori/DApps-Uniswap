// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "./ERC20.sol";

contract Dex {

    // account: buyer
    // _tokenAddr: token adress to be received
    // _cost: cost to be paid
    // _amount: amount to be received
    event buy(address account, address _tokenAddr, uint256 _cost, uint256 _amount);

    // account: seller
    // _tokenAddr: token adress to be paid
    // _cost: cost to be paid
    // _amount: amount to be received
    event sell(address account, address _tokenAddr, uint256 _cost, uint256 _amount);

    // Exchangeable Token Mapping
    mapping(address => bool) public supportedTokenAddr;

    modifier supportsToken(address _tokenAddr) {
        require(supportedTokenAddr[_tokenAddr] == true, "This Token is not supported");
        _;
    }

    constructor(address[] memory _tokenAddr) {
        for (uint i = 0; i < _tokenAddr.length; i++) {
            supportedTokenAddr[_tokenAddr[i]] = true;
        }
    }

    // function to buy token(ERC20)
    // _tokenAddr: token(ERC20) address to to buy
    // _cost: fund(ETH) to be paid
    // _amount: token(ERC20) to buy
    function buyToken(address _tokenAddr, uint256 _cost, uint256 _amount) external payable supportsToken(_tokenAddr) {
        ERC20 token = ERC20(_tokenAddr);
        require(msg.value == _cost, "Insufficient fund");
        require(token.balanceOf(address(this)) >= _amount, "Token sold out");
        token.transfer(msg.sender, _amount);
        emit buy(msg.sender, _tokenAddr, _cost, _amount);
    }

    // function to sell token(ERC20)
    // _tokenAddr: token(ERC20) address to be sold
    // _cost: token(ERC20) to be paid
    // _amount: fund(ETH) to be received
    function sellToken(address _tokenAddr, uint256 _cost, uint256 _amount) external payable supportsToken(_tokenAddr) {
        ERC20 token = ERC20(_tokenAddr);
        require(token.balanceOf(msg.sender) >= _cost, "Insufficient token balance");
        require(address(this).balance >= _amount, "Dex does not have enough funds");
        token.transferFrom(msg.sender, address(this), _cost);
        (bool success, ) = payable(msg.sender).call{value: _amount}("");
        require(success, "ETH transfer failed");
        emit sell(msg.sender, _tokenAddr, _cost, _amount);
    }
}