// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract ERC20 {
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowances;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);

    constructor(string memory _name, string memory _symbol, uint256 _totalSupply) {
        name = _name;
        symbol = _symbol;
        totalSupply = _totalSupply;
        balances[msg.sender] = totalSupply;
    }

    // Returns the amount of tokens owned by _owner.
    function balanceOf(address _owner) external view returns (uint256) {
        return balances[_owner];
    }


   /**
     * Returns the remaining number of tokens that spender will be allowed to spend on behalf of owner through transferFrom. This is zero by default.
     * This value changes when approve or transferFrom are called.
     */
    function allowance(address _owner, address _spender) public view returns (uint256) {
        return allowances[_owner][_spender];
    }

   /**
     * Moves amount tokens from the caller’s account to recipient.
     * Returns a boolean value indicating whether the operation succeeded.
     * Emits a Transfer event.
     */
    function transfer(address _to, uint256 _value) external returns (bool) {
        _transfer(msg.sender, _to, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) external returns (bool) {
        require(allowances[_from][msg.sender] >= _value, "Transfer amount exceeds allowance");
        _transfer(_from, _to, _value);
        allowances[_from][msg.sender] -= _value;
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool) {
        allowances[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function _transfer(address _from, address _to, uint256 _value) private {
        require(_value <= balances[_from], "Insufficient balance");
        require(_from != _to, "from = to");
        balances[_from] -= _value;
        balances[_to] += _value;
        emit Transfer(_from, _to, _value);
    }
}
