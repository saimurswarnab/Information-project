document.addEventListener("DOMContentLoaded", function () {
    const informationForm = document.getElementById("informationForm");
    const createEntryButton = document.getElementById("createEntry");
    const searchButton = document.getElementById("searchButton");
    const resultDiv = document.getElementById("result");
    const searchIDInput = document.getElementById("searchID");

    // Replace this with your contract address and ABI
    const contractAddress = "0x42C345F2B5f70A98e9095f327f6AF848b7a8A7ec";
    const contractABI = [
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_informationID",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "_name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "_email",
                    "type": "string"
                }
            ],
            "name": "createInformationEntry",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "informationID",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "bytes32",
                    "name": "hashCode",
                    "type": "bytes32"
                }
            ],
            "name": "InformationEntryCreated",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_informationID",
                    "type": "uint256"
                }
            ],
            "name": "getInformationByInformationID",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "informationID",
                    "type": "uint256"
                },
                {
                    "internalType": "string",
                    "name": "name",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "email",
                    "type": "string"
                },
                {
                    "internalType": "bytes32",
                    "name": "hashCode",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]; // Your contract's ABI

    const web3 = new Web3(Web3.givenProvider);
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    createEntryButton.addEventListener("click", async () => {
        const informationID = document.getElementById("informationID").value;
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;

        try {
            // Make a transaction to create an entry in the contract
            const accounts = await web3.eth.getAccounts();
            const transaction = await contract.methods.createInformationEntry(
                informationID,
                name,
                email
            ).send({ from: accounts[0] });

            // Display a success message
            resultDiv.innerText = `Transaction Hash: ${transaction.transactionHash}`;
        } catch (error) {
            console.error(error);
            resultDiv.innerText = "Error: " + error.message;
        }
    });

    searchButton.addEventListener("click", async () => {
        const searchID = searchIDInput.value;
        try {
            // Call the contract to retrieve information by ID
            const info = await contract.methods.getInformationByInformationID(searchID).call();
            
            // Check if the information exists
            if (info.informationID !== "0") {
                resultDiv.innerHTML = `
                    <p>Information ID: ${info.informationID}</p>
                    <p>Name: ${info.name}</p>
                    <p>Email: ${info.email}</p>
                    <p>Hash Code: ${info.hashCode}</p>
                `;
            } else {
                resultDiv.innerText = "Information entry not found.";
            }
        } catch (error) {
            console.error(error);
            resultDiv.innerText = "Error: " + error.message;
        }
    });
});
