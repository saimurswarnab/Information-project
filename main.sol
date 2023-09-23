// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Information {
    struct InformationEntry {
        uint informationID;
        string name;
        string email;
        bytes32 hashCode;
    }

    mapping (uint => InformationEntry) informationMapping;
    mapping (bytes32 => uint) hashCodeToInformationID; // Mapping from hash code to information ID
    uint[] informationIDs; // To keep track of Information IDs

    address contractOwner;

    event InformationEntryCreated(uint informationID, bytes32 hashCode);

    modifier onlyOwner() {
        require(msg.sender == contractOwner, "You are not authorized");
        _;
    }

    constructor() {
        contractOwner = msg.sender;
    }

    function createInformationEntry(
        uint _informationID,
        string memory _name,
        string memory _email
    ) public onlyOwner {
        bytes32 hashCode = keccak256(abi.encodePacked(_informationID, _name, _email));
        require(informationMapping[_informationID].informationID == 0, "Information entry already exists");

        informationMapping[_informationID] = InformationEntry({
            informationID: _informationID,
            name: _name,
            email: _email,
            hashCode: hashCode
        });

        hashCodeToInformationID[hashCode] = _informationID; // Store the mapping from hash code to information ID
        informationIDs.push(_informationID);
        emit InformationEntryCreated(_informationID, hashCode);
    }

    function getInformationByInformationID(uint _informationID) public view returns (
        uint informationID,
        string memory name,
        string memory email,
        bytes32 hashCode
    ) {
        InformationEntry storage entry = informationMapping[_informationID];
        require(entry.informationID != 0, "Information entry not found");
        
        informationID = entry.informationID;
        name = entry.name;
        email = entry.email;
        hashCode = entry.hashCode;
    }

    function getInformationByHashCode(bytes32 _hashCode) public view returns (
        uint informationID,
        string memory name,
        string memory email,
        bytes32 hashCode
    ) {
        uint _informationID = hashCodeToInformationID[_hashCode];
        require(_informationID != 0, "Information entry not found for the given hash code");

        InformationEntry storage entry = informationMapping[_informationID];
        informationID = entry.informationID;
        name = entry.name;
        email = entry.email;
        hashCode = entry.hashCode;
    }
}
