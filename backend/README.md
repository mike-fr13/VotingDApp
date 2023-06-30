# README

    Disclaimer: Development Code

    The code provided in this repository is intended for development and learning purposes only. It is not suitable for production use without proper review, testing, and security considerations. The code may contain bugs, vulnerabilities, or other issues that could result in unexpected behavior or compromise the security of the system.

    This repository contains the backend code for the VotingDapp project. The backend is developed using Hardhat, a development environment for Ethereum. It includes the smart contract code and test cases.
    Running Tests

# Backend Deployment and Tests run

- To run the tests for the backend, use the following commands:

    `npx hardhat test`

- For gas reporting during tests, use the following command:

    `REPORT_GAS=true npx hardhat test`

## Deploying the Backend Locally with Hardhat

- To start a local blockchain, run the following command:

    `npx hardhat node`

- To deploy the contract locally, use the following command:

    `npx hardhat run scripts/deploy.js --network localhost`

- To inject test data, use the following command:

    `npx hardhat run scripts/inject_data.js --network localhost`

- To deploy the backend on the Goerli testnet, use the following command:

    `npx hardhat run scripts/deploy.js --network goerli`

# Fixing the Denial-of-Service (DoS) Vulnerability in tallyVotes()

The original implementation of tallyVotes() function iterated over the entire array of proposals to determine the proposal with the most votes. This approach potentially allowed a DoS attack if too many proposals were entered. The fix involves evaluating the winning proposal with each new vote, avoiding the need to iterate over all the proposals.

Additionally, the votestally() function could be modified or removed, as it is no longer necessary apart from triggering the VotesTallied event. This event could be emitted during the transition from VotingSessionStarted to VotingSessionEnded.
Testing Strategy for the Voting Contract
General Organization

The test file is divided into multiple sections, each corresponding to a specific functionality of the voting contract.

Several fixture functions are defined at the beginning of the file to deploy the voting contract and prepare it for various test scenarios:

    deployFixture(): Deploys the contract.
    prepareProposalDeposalFixture(): Previous fixture plus adding voters and changing the state.
    prepareVotingFixture(): Previous fixture plus adding proposals and changing the state.
    prepareTallyFixture(): Previous fixture plus adding votes.

Test Sections
Contract Deployment Tests

This section verifies that the voting contract is deployed and initialized correctly.

    It checks the owner of the contract.
    It checks that the initial winningProposalID is 0.
    It checks that the initial workflow status is "RegisteringVoters" (0).

Workflow Status Change Tests

This section verifies that the different workflow status transitions are handled correctly.

    For each workflow status transition (startProposalsRegistering(), endProposalsRegistering(), startVotingSession(), endVotingSession()), it checks that calling the function by a non-owner fails.
    It checks that the workflow status is updated correctly after each transition.
    It checks that a WorkflowStatusChange event is emitted at each workflow status transition.
    It checks that certain transitions are not allowed.

Voter Registration Tests

This section verifies that voter registration is handled correctly.

    It checks that only the owner of the contract can add voters.
    It checks that adding voters is only possible when the workflow status is "RegisteringVoters".
    It checks that adding a voter emits a VoterRegistered event.
    It checks that adding an already registered voter fails.

Proposal Registration Tests

This section verifies that proposal registration is handled correctly.

    It checks that adding a proposal is only possible when the workflow status is "ProposalsRegistrationStarted".
    It checks that only a registered voter can add a proposal.
    It checks that adding an empty proposal fails.
    It checks that adding a proposal emits a ProposalRegistered event.

Voting Tests

This section tests the voting functionality.
setVote() Tests

    It checks that an error "You're not a voter" is returned if an unregistered voter tries to vote.
    It checks that an error "Voting session haven't started yet" is returned if voting is attempted before the voting session has started.
    It checks that an error "Proposal not found" is returned if voting for a non-existent proposal is attempted.
    It checks that a voter can vote for an existing proposal, which emits a Voted event.
    It checks that the hasVoted property of the voter is set to true after voting.
    It checks that the votedProposalId property of the voter is updated with the proposal ID after voting.
    It checks that voting for a proposal increases the vote count for that proposal by 1.
    It checks that a voter cannot vote twice.

Additional tallyVotes() Tests

    It checks that an error is returned if a non-owner attempts to execute the tallyVotes() function.
    It checks that an error "Current status is not voting session ended" is returned if tallyVotes() is called when the voting session is not yet ended.
    It checks that calling tallyVotes() by the owner succeeds and emits a WorkflowStatusChange event when the workflow status is 4 (voting session ended).

Vote Counting and Result Tests
tallyVotes() Results Tests

    It checks that tallyVotes() updates the winningProposalID to the ID of the proposal with the highest number of votes.
    It checks that if no votes have been cast, tallyVotes() returns the GENESIS proposal ID as the winningProposalID.

License

This project is licensed under the MIT License.
Acknowledgements

The development of this project was inspired by the Ethereum blockchain and the decentralized voting concept.

Thank you for your interest in the VotingDapp backend project. If you have any further questions, feel free to reach out. Happy voting!

User
pour les parties en code, pourrais tu les entourer de ceci ``` et me donner la source de tous le fichier en un seul morceau ?
ChatGPT

Bien sûr ! Voici le fichier README complet en un seul morceau avec les parties de code entourées de balises ```.

csharp

# Backend Description of VotingDapp

This repository contains the backend code for the VotingDapp project. The backend is developed using Hardhat, a development environment for Ethereum. It includes the smart contract code and test cases.

## Running Tests

To run the tests for the backend, use the following commands:

npx hardhat test

bash


For gas reporting during tests, use the following command:

REPORT_GAS=true npx hardhat test

bash


## Deploying the Backend Locally with Hardhat

### Launching the Local Blockchain

To start a local blockchain, run the following command:

`npx hardhat node`

## Deploying the Contract Locally

To deploy the contract locally, use the following command:

`npx hardhat run scripts/deploy.js --network localhost`

## Injecting Test Data (If Necessary)

To inject test data, use the following command:

`npx hardhat run scripts/inject_data.js --network localhost`

## Deploying the Backend on the Goerli Testnet

To deploy the backend on the Goerli testnet, use the following command:

`npx hardhat run scripts/deploy.js --network goerli`

# Fixing the Denial-of-Service (DoS) Vulnerability in tallyVotes()

The original implementation of tallyVotes() function iterated over the entire array of proposals to determine the proposal with the most votes. This approach potentially allowed a DoS attack if too many proposals were entered. The fix involves evaluating the winning proposal with each new vote, avoiding the need to iterate over all the proposals.

Additionally, the votestally() function could be modified or removed, as it is no longer necessary apart from triggering the VotesTallied event. This event could be emitted during the transition from VotingSessionStarted to VotingSessionEnded.


# Testing Strategy for the Voting Contract
## General Organization

The test file is divided into multiple sections, each corresponding to a specific functionality of the voting contract.

Several fixture functions are defined at the beginning of the file to deploy the voting contract and prepare it for various test scenarios:

- deployFixture(): Deploys the contract.
- prepareProposalDeposalFixture(): Previous fixture plus adding voters and changing the state.
- prepareVotingFixture(): Previous fixture plus adding proposals and changing the state.
- prepareTallyFixture(): Previous fixture plus adding votes.

## Test Sections
### Contract Deployment Tests

This section verifies that the voting contract is deployed and initialized correctly.

- It checks the owner of the contract.
- It checks that the initial winningProposalID is 0.
- It checks that the initial workflow status is "RegisteringVoters" (0).

### Workflow Status Change Tests

This section verifies that the different workflow status transitions are handled correctly.

- For each workflow status transition (startProposalsRegistering(), endProposalsRegistering(),  startVotingSession(), endVotingSession()), it checks that calling the function by a non-owner fails.
- It checks that the workflow status is updated correctly after each transition.
- It checks that a WorkflowStatusChange event is emitted at each workflow status transition.
- It checks that certain transitions are not allowed.

### Voter Registration Tests

This section verifies that voter registration is handled correctly.

- It checks that only the owner of the contract can add voters.
- It checks that adding voters is only possible when the workflow status is "RegisteringVoters".
- It checks that adding a voter emits a VoterRegistered event.
- It checks that adding an already registered voter fails.

### Proposal Registration Tests

This section verifies that proposal registration is handled correctly.

- It checks that adding a proposal is only possible when the workflow status is "ProposalsRegistrationStarted".
- It checks that only a registered voter can add a proposal.
- It checks that adding an empty proposal fails.
- It checks that adding a proposal emits a ProposalRegistered event.

### Voting Tests

This section tests the voting functionality.
setVote() Tests

- It checks that an error "You're not a voter" is returned if an unregistered voter tries to vote.
- It checks that an error "Voting session haven't started yet" is returned if voting is attempted before the voting session has started.
- It checks that an error "Proposal not found" is returned if voting for a non-existent proposal is attempted.
- It checks that a voter can vote for an existing proposal, which emits a Voted event.
- It checks that the hasVoted property of the voter is set to true after voting.
- It checks that the votedProposalId property of the voter is updated with the proposal ID after voting.
- It checks that voting for a proposal increases the vote count for that proposal by 1.
- It checks that a voter cannot vote twice.

### Additional tallyVotes() Tests

- It checks that an error is returned if a non-owner attempts to execute the tallyVotes() function
- It checks that an error "Current status is not voting session ended" is returned if tallyVotes() is called when the voting session is not yet ended.
- It checks that calling tallyVotes() by the owner succeeds and emits a WorkflowStatusChange event when the workflow status is 4 (voting session ended).

### Vote Counting and Result Tests
tallyVotes() Results Tests

- It checks that tallyVotes() updates the winningProposalID to the ID of the proposal with the highest number of votes.
-It checks that if no votes have been cast, tallyVotes() returns the GENESIS proposal ID as the winningProposalID.

-----------------

```
 Voting contract Tests
    Contract Deployment
      ✔ should deploy the smart contract (182ms)
      variable initailisation
        ✔ Should initialise winningProposalID to 0 
        ✔ Should initialise with RegisteringVoters status 0
    Check Workflow status change
      startProposalsRegistering() tests
        ✔ Should revert if not calle by owner (49ms)
        ✔ Should change workflow status and emit WorkflowStatusChange
        ✔ Should change workflowStatus to ProposalsRegistrationStarted
      endProposalsRegistering() tests
        ✔ Should revert if not calle by owner (109ms)
        ✔ Should change workflow status and emit WorkflowStatusChange
        ✔ Should change workflowStatus to ProposalsRegistrationEnded (41ms)
      startVotingSession() tests
        ✔ Should revert if not calle by owner (41ms)
        ✔ Should change workflow status and emit WorkflowStatusChange (58ms)
        ✔ Should change workflowStatus to VotingSessionStarted (46ms)
      endVotingSession() tests
        ✔ Should revert if not calle by owner (147ms)
        ✔ Should change workflow status and emit WorkflowStatusChange
        ✔ Should change workflowStatus to VotingSessionEnded
      Check impossible states transitions
        ✔ Should revert if a transition call to same state (ProposalsRegistrationStarted in our exemple)
        ✔ Should revert endProposalsRegistering() from an unexpected state
        ✔ Should revert startVotingSession() from an unexpected state
        ✔ Should revert endVotingSession() from an unexpected state
    RegisteringVoters tests
      addVoter() tests
        ✔ Should revert if not called by contract owner 
        ✔ Should revert if not in RegisteringVoters status (56ms)
        ✔ Should add a voter if called by contract owner and emit VoterRegistered event (45ms)
        ✔ Should revert if voter allready registered (59ms)
      getVoter() tests
        ✔ Should revert if caller is not a registered Voter
        ✔ Shouldn't get an empty Voter structure if caller is a registered Voter and address parameter does not belongs to a regitered voter
        ✔ Should get hasVoted property to false after registering a Voter
        ✔ Should get votedProposalId property to 0 after registering a Voter (40ms)
        ✔ Should get Voter if caller is a registered Voter and address parameter belongs to a regitered voter
    Registering Proposals tests
      addProposal() function tests
        ✔ Should revert if not in ProposalsRegistrationStarted status (52ms)
        ✔ Should revert if called with an unregistered voter (76ms)
        ✔ Should revert if called with an empty proposal
        ✔ Should add multiple proposal and emit ProposalRegistered event (47ms)
      getOneProposal() function tests
        ✔ Should revert with 'You're not a voter' error if called with an unregistered voter
        ✔ Should have a 'GENESIS' proposal at index 0 after starting Proposals Registering
        ✔ Should be possible de retrieve an inserted proposal with corresponding description (39ms)
        ✔ Should have a proposal with 0 voteCount initialisation after a proposal registration (38ms)
    Voting tests
      setVote() tests
        ✔ Should revert with 'You're not a voter' error if called with an unregistered voter (91ms)
        ✔ Should revert with 'Voting session havent started yet' error if not in VotingSessionStarted status
        ✔ Should revert with 'Proposal not found' error if trying to vote whith a proposal index that does not exist (96ms)
        ✔ Should be able to vote for an existing proposal and emit event 'Voted'
        ✔ Should set hasVoted to true for the Voter
        ✔ Should set votedProposalId property to proposalID after vote (46ms)
        ✔ Should increment by 1 selected proposal (60ms)
        ✔ Shouldn't be able to vote twice
    tallyVotes and result tests
      tallyVotes() execution tests
        ✔ Should revert if not contract owner  (63ms)
        ✔ Should revert with 'Current status is not voting session ended' error if not in VotingSessionEnded status
        ✔ Should success and emit 'WorkflowStatusChange' if called by owner with WorkflowStatus 4
      tallyVotes() results tests
        ✔ Should set the winningProposalID to proposal ID  with maximum vote (53ms)
        ✔ Should return the GENESIS winningProposalID if there is no vote


  49 passing (2s)

-------------|----------|----------|----------|----------|----------------|
File         |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
-------------|----------|----------|----------|----------|----------------|
 contracts/  |      100 |      100 |      100 |      100 |                |
  Voting.sol |      100 |      100 |      100 |      100 |                |
-------------|----------|----------|----------|----------|----------------|
All files    |      100 |      100 |      100 |      100 |                |
-------------|----------|----------|----------|----------|----------------|
```

License

This project is licensed under the MIT License.
Acknowledgements

The development of this project was inspired by the Ethereum blockchain and the decentralized voting concept.

Thank you for your interest in the VotingDapp backend project. If you have any further questions, feel free to reach out. Happy voting!

