async function main() {
    const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    const owner = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    const account2 = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
    const account3 = '0x90F79bf6EB2c4f870365E785982E1f101E93b906';
    const account4 = '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65'
    const account5= '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc'
    const account6 = '0x976EA74026E726554dB657fA54763abd0C3a0aa9'

    const loremIpsum = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    
    const votingABI = require('./abi.js');
    const { ethers } = require("hardhat");
  
    const provider = ethers.provider;
    const signer = provider.getSigner();
    const Contract = new ethers.Contract(contractAddress, votingABI, signer);

    const account2Signer = await Contract.provider.getSigner(account2)
  
    console.log('addVoter  - account2')
    await Contract.addVoter(account2);
    console.log('addVoter  - account3')
    await Contract.addVoter(account3);
    console.log('addVoter  - account4')
    await Contract.addVoter(account4);
    console.log('addVoter  - account5')
    await Contract.addVoter(account5);

    console.log('startProposalsRegistering')
    await Contract.startProposalsRegistering();

    console.log('addProposal 1')
    await Contract.connect(account2Signer).addProposal("ma premiere proposition : "+loremIpsum);
    console.log('addProposal 2')
    await Contract.connect(account2Signer).addProposal("ma seconde proposition : "+loremIpsum);
    console.log('addProposal 3')
    await Contract.connect(account2Signer).addProposal("ma troisieme proposition : "+loremIpsum);
    console.log('addProposal 4')
    await Contract.connect(account2Signer).addProposal("ma quatrième proposition : "+loremIpsum);
    console.log('addProposal 5')
    await Contract.connect(account2Signer).addProposal("ma cinquième proposition : "+loremIpsum);


}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
