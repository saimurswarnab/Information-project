document.addEventListener("DOMContentLoaded", function () {
    const informationForm = document.getElementById("informationForm");
    const createEntryButton = document.getElementById("createEntry");
    const searchButton = document.getElementById("searchButton");
    const searchHashCodeButton = document.getElementById("searchHashCodeButton");
    const resultDiv = document.getElementById("result");
    const searchIDInput = document.getElementById("searchID");

    // Replace with your contract address and ABI
    const contractAddress = "";
    const contractABI = []; // Your contract's ABI

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

    searchHashCodeButton.addEventListener("click", async () => {
       // Convert the search hash code to bytes32
        const searchHashCodeInput = document.getElementById("searchHashCode");
        const searchHashCode = searchHashCodeInput.value;

        try {
            // Remove the "0x" prefix if present
            const cleanSearchHashCode = searchHashCode.startsWith("0x") ? searchHashCode.slice(2) : searchHashCode;
            
            // Add "0x" prefix to the cleaned hash code and convert to bytes32
            const searchHashBytes32 = "0x" + cleanSearchHashCode;
            
            // Call the contract to retrieve information by hash code
            const info = await contract.methods.getInformationByHashCode(searchHashBytes32).call();
            
            // Check if the information exists
            if (info.informationID !== "0") {
                // If the information ID is found, call the getInformationByInformationID function to get the full information.
                resultDiv.innerHTML = `
                    <p>Information ID: ${info.informationID}</p>
                    <p>Name: ${info.name}</p>
                    <p>Email: ${info.email}</p>
                    <p>Hash Code: ${info.hashCode}</p>
                `;
            } else {
                resultDiv.innerText = "Information entry not found for the given hash code.";
            }
        } catch (error) {
            console.error(error);
            resultDiv.innerText = "Error: " + error.message;
        }

    });
});
