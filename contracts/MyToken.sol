// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

/// @title Custom token extended from ERC20 
/// @author otolol
contract MyToken is ERC20, AccessControl, ERC20Permit, ERC20Votes {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");


    /// @notice constructor for myToken register token name and graant Roles
    constructor() ERC20("MyToken", "MTK") ERC20Permit("MyToken") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /// @notice mint tokens on specific address and specific amount
    /// @dev mint permission has user with MINTER_ROLE
    /// @param to address where token should be mint
    /// @param amount amount of tokens for mint
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    /// @notice calls parent(ERC20) _afterTokenTransfer funtion
    /// @param from from where token should be transfered
    /// @param to where should be toke transfered
    /// @param amount how much token should be transfer
    function _afterTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._afterTokenTransfer(from, to, amount);
    }

    /// @notice calls ERC20 _mint fuction
    /// @param to address where token should be mint
    /// @param amount amount of tokens for mint
    function _mint(address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._mint(to, amount);
    }

    /// @notice calls ERC20 _burn function
    /// @param account burn account address
    /// @param amount for burn
    function _burn(address account, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._burn(account, amount);
    }
}