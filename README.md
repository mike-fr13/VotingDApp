# VotingDApp

VotingDApp is a decentralized voting application developed as part of the Blockchain Developer training module at Alyra (Buterin batch, May-July 2023).

## Developers:

    Noam Mansouri
    Yannick Tison

# Demo

You can find a video demonstration of the DApp at this link: https://www.loom.com/share/2f67eab4b53b40be9471cefa5f09032e

# Overview

VotingDApp is a blockchain-based application that allows users to participate in voting processes in a transparent and secure manner. The application leverages the power of blockchain technology to ensure the integrity of the voting process and eliminate the need for intermediaries.
Architecture

The project follows a client-server architecture, with separate components for the **backend** and **frontend**.

# Backend

The backend of the application is responsible for managing the smart contract and interacting with the Ethereum blockchain. It is built using Solidity and the Hardhat framework. The backend handles the deployment of the smart contract, registration of voters, proposal creation, voting, vote tallying, and workflow management.

Detailed documentation for the backend can be found [here](backend/README.md).

# Frontend

The frontend of the application provides a user-friendly interface for interacting with the voting process. It is developed using React.js and Chakra UI. The frontend allows users to view proposals, submit votes, and monitor the status of the voting process.

Detailed documentation for the frontend can be found [here](frontend/README.md).

# Getting Started

To get started with the application, please refer to the individual README files in the backend and frontend directories for setup instructions and usage guidelines.

# Deployment

The Voting DApp is deployed on [Vercel](https://voting-dapp-beryl.vercel.app/)  
This DApp is linked to solidity contract deployed on Goerli at [0x8f7620fb2F493435c49cBEc55966d022f922D861](https://goerli.etherscan.io/address/0x8f7620fb2F493435c49cBEc55966d022f922D861)

Feel free to explore the code and documentation to understand the inner workings of the VotingDApp. Happy voting!
