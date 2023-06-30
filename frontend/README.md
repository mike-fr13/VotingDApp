# VotingDapp Frontend

This repository contains the frontend code for the VotingDapp project. The project is a decentralized application (DApp) that allows users to participate in a voting process using blockchain technology.

## Prerequisites

Before running the frontend application, make sure you have the following dependencies installed:

- Node.js
- npm (Node Package Manager)

## Installation

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Run the following command to install the required dependencies:

`npm install`


## Configuration

1. Create a `.env.local` file in the project root directory.
2. Set the following environment variables in the `.env.local` file:

`NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS=<voting_contract_address>`


Replace `<voting_contract_address>` with the address of the deployed voting contract on the Ethereum network.

## Usage

To start the frontend application, run the following command:

`npm run dev`


The application will be accessible at `http://localhost:3000`.

## Features

- **Voter Registration**: Voters can register their Ethereum addresses to participate in the voting process.
- **Proposal Registration**: Registered voters can submit proposals for the voting process.
- **Voting Session**: Once the proposal registration is closed, voters can cast their votes for the registered proposals.
- **Voting Results**: After the voting session ends, the votes are tallied, and the winning proposal is determined.

## Folder Structure

The important directories and files in the project are as follows:

- `components`: Contains reusable UI components used throughout the application.
- `context`: Contains context providers and hooks for sharing data between components.
- `pages`: Contains the main application pages.
- `utils`: Contains utility functions and contracts ABIs.

## Technologies Used

- React: JavaScript library for building user interfaces.
- Next.js: React framework for server-side rendering and routing.
- Chakra UI: Component library for building accessible and responsive UI.
- ethers.js: Ethereum library for interacting with smart contracts.

## Contributing

Contributions to the project are welcome. If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

The development of this project was inspired by the Ethereum blockchain and the decentralized voting concept.

---

Thank you for your interest in the VotingDapp frontend project. If you have any further questions, feel free to reach out. Happy voting!


