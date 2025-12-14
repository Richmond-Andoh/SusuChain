// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SusuChainVault
 * @dev A mobile-first decentralized micro-savings and emergency fund DApp.
 * Users can lock funds until a target goal is reached or trigger an emergency withdrawal.
 */
contract SusuChainVault {
    struct Vault {
        uint256 balance;
        uint256 targetAmount;
        bool isLocked;
        bool emergencyWithdrawn;
    }

    // Mapping from user address to their vault
    // One vault per user
    mapping(address => Vault) public vaults;

    // Events
    event VaultCreated(address indexed user, uint256 targetAmount);
    event Deposited(address indexed user, uint256 amount, uint256 newBalance);
    event EmergencyWithdrawn(address indexed user, uint256 amount);

    /**
     * @dev Create a new savings vault.
     * @param _targetAmount The savings goal amount in wei.
     */
    function createVault(uint256 _targetAmount) external {
        require(_targetAmount > 0, "Target amount must be greater than 0");
        require(!vaults[msg.sender].isLocked, "Vault already active");
        
        // If vault exists but was withdrawn/completed, reset it
        // We treat 'isLocked' as the active flag. 
        // If balance > 0, user should withdraw first (though emergencyWithdraw clears it)
        require(vaults[msg.sender].balance == 0, "Existing funds must be withdrawn");

        vaults[msg.sender] = Vault({
            balance: 0,
            targetAmount: _targetAmount,
            isLocked: true,
            emergencyWithdrawn: false
        });

        emit VaultCreated(msg.sender, _targetAmount);
    }

    /**
     * @dev Deposit funds into the vault.
     */
    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        require(vaults[msg.sender].isLocked, "No active vault");
        require(!vaults[msg.sender].emergencyWithdrawn, "Vault is emergency withdrawn");

        vaults[msg.sender].balance += msg.value;

        emit Deposited(msg.sender, msg.value, vaults[msg.sender].balance);
    }

    /**
     * @dev Withdraw funds in case of emergency or when goal is reached.
     * This function allows withdrawing the full balance.
     * If the goal is not reached, it is considered an emergency withdrawal.
     */
    function emergencyWithdraw() external {
        Vault storage userVault = vaults[msg.sender];
        require(userVault.balance > 0, "No funds to withdraw");
        require(userVault.isLocked, "No active vault");

        uint256 amount = userVault.balance;
        
        // Update state before transfer to prevent re-entrancy
        userVault.balance = 0;
        userVault.isLocked = false;
        userVault.emergencyWithdrawn = true;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        emit EmergencyWithdrawn(msg.sender, amount);
    }
}
