document.addEventListener("DOMContentLoaded", function () {
    const informationForm = document.getElementById("informationForm");
    const createEntryButton = document.getElementById("createEntry");
    const searchButton = document.getElementById("searchButton");
    const resultDiv = document.getElementById("result");
    const searchIDInput = document.getElementById("searchID");

    // Replace this with your contract address and ABI
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
});
