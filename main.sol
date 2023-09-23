// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;


contract SampleWallet {
    // The owner of the wallet
    address payable public owner;

    // Allowance mapping to track approved amounts for each address
    mapping(address => uint) public allowance;

    // Mapping to track whether an address is allowed to send transactions
    mapping(address => bool) public isAllowedToSend;

    // Mapping to track guardians
    mapping(address => bool) public guardian;

    // Address of the next proposed owner
    address payable nextOwner;

    // Count of confirmations received from guardians for owner reset
    uint guardiansResetCount;

    // Number of confirmations required from guardians for owner reset
    uint public constant confirmationsFromGuardiansForReset = 3;

    constructor() {
        // Set the contract deployer as the initial owner
        owner = payable(msg.sender);
    }

    /**
     * @dev Adds a new guardian to the wallet
     * @param _guardian The address of the guardian to add
     */
    function addGuardian(address _guardian) public {
        require(msg.sender == owner, "You are not the owner, aborting!");
        require(!guardian[_guardian], "The address is already a guardian");

        guardian[_guardian] = true;
    }

    /**
     * @dev Proposes a new owner for the wallet
     * @param newOwner The address of the proposed new owner
     */
    function proposeNewOwner(address payable newOwner) public {
        require(guardian[msg.sender], "You are not a guardian, aborting");
       
        // Check if the proposed owner is different from the current nextOwner
        if (nextOwner != newOwner) {
            nextOwner = newOwner;
            guardiansResetCount = 0;
        }

        guardiansResetCount++;

        // If the required number of confirmations is reached, update the owner
        if (guardiansResetCount >= confirmationsFromGuardiansForReset) {
            owner = nextOwner;
            nextOwner = payable(address(0));
        }
    }

    /**
     * @dev Sets the allowance for a given address
     * @param _from The address for which to set the allowance
     * @param _amount The amount to set as the allowance
     */
    function setAllowance(address _from, uint _amount) public {
        require(msg.sender == owner, "You are not the owner, aborting!");
        allowance[_from] = _amount;
        isAllowedToSend[_from] = true;
    }

    /**
     * @dev Denies sending transactions for a given address
     * @param _from The address for which to deny sending transactions
     */
    function denySending(address _from) public {
        require(msg.sender == owner, "You are not the owner, aborting!");
        isAllowedToSend[_from] = false;
    }


    /**
     * @dev Transfers a specified amount to a given address with optional payload
     * @param _to The address to transfer the funds to
     * @param _amount The amount to transfer
     * @param payload The payload data for the transfer
     * @return The return data from the transfer
     */
    function transfer(address payable _to, uint _amount, bytes memory payload) public returns (bytes memory) {
        require(_amount <= address(this).balance, "Can't send more than the contract owns, aborting.");

        if (msg.sender != owner) {
            require(isAllowedToSend[msg.sender], "You are not allowed to send any transactions, aborting");
            require(allowance[msg.sender] >= _amount, "You are trying to send more than you are allowed to, aborting");
            allowance[msg.sender] -= _amount;
        }

        (bool success, bytes memory returnData) = _to.call{value: _amount}(payload);
        require(success, "Transaction failed, aborting");
        return returnData;
    }


    receive() external payable {}
}