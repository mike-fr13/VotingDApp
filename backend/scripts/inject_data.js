async function main() {
    const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
    const owner = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    const account2 = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
    const account3 = '0x90F79bf6EB2c4f870365E785982E1f101E93b906';
    
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

    console.log('startProposalsRegistering')
    await Contract.startProposalsRegistering();

    console.log('addProposal 1')
    await Contract.connect(account2Signer).addProposal("ma premiere proposition");
    console.log('addProposal 2')
    await Contract.connect(account2Signer).addProposal("ma seconde proposition");
    console.log('addProposal 3')
    await Contract.connect(account2Signer).addProposal("ma troisieme proposition");
    console.log('addProposal 4')
    await Contract.connect(account2Signer).addProposal("ma quatrième proposition");
    console.log('addProposal 5')
    await Contract.connect(account2Signer).addProposal("ma cinquième proposition");


}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
