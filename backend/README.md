# Description de la partie Back

npx hardhat test
REPORT_GAS=true npx hardhat test


# Deploiement du backend en en Local sous hardhat

## Lancement de la blockchain en local
```bash npx hardhat node```

## deploiement du contrat en local 
```bash npx hardhat run scripts/deploy.js --network localhost```

## injection des données de tests si nécéssaire
```bash npx hardhat run scripts/inject_data.js --network localhost```

# Deploiement du backend en en Local sous Goerli
```bash npx hardhat run scripts/deploy.js --network goerli```


# Correction du DOS sur le tallyVotes()
Cette fonction parcourait l'ensemble du tableau des propositions afin de determiner celle ayant le plus de vote. Cela offrait potentiellement  une attaque DOS si de trop nombreuses proposals étaient saisies. La correction apportée pass par une évaluation de la proposal gagnante lors de chaque nouveau vote, cela evitant la boucle de parcourt de l'ensemble des proposals.

Nous aurions pu aller pus loin et modifier voir supprimer la fonction `votestally()` car celle ci n'est plus nécéssaire mis à part pour envoyé l'event `VotesTallied`.

Cet event pourrait tout aussi bien être envoyé lors du changement de statut de `VotingSessionStarted` vers `VotingSessionEnded`  


# Stratégie des tests pour le contrat de vote

## Organisation générale

Le fichier de test est organisé en plusieurs sections, chacune correspondant à une série de tests sur une fonctionnalité spécifique du contrat de vote.

Une série de fonctions d'amorçage (fixtures) sont définies au début du fichier pour déployer le contrat de vote et le préparer pour différents scénarios de test.  

```
- deployFixture() : un simple deploiment du contrat.
- prepareProposalDeposalFixture() : fixture précédente + ajout de Voters et chgt d'état
- prepareVotingFixture() : fixture précédente + ajout de proposals et chgt d'état
- prepareTallyFixture(): fixture précédente + ajout de votes
```

**Ci dessous,  les différentes sections de test :**
## Tests de déploiement du contrat

Cette section vérifie que le contrat de vote est correctement déployé et initialisé. 

- Elle vérifie le `owner`.

- Elle vérifie que le `winningProposalID` est initialement égal à 0.

- Elle vérifie que le statut de workflow initial est "RegisteringVoters" (0).

## Tests de changement de statut de workflow

Cette section vérifie que les différentes transitions de statut de workflow sont correctement gérées.

- Pour chaque transition de statut de workflow (`startProposalsRegistering()`, `endProposalsRegistering()`, `startVotingSession()`, `endVotingSession()`), elle vérifie que l'appel de la fonction par un non-owner échoue.

- Elle vérifie que le statut de workflow est correctement mis à jour après chaque transition.

- Elle vérifie qu'un événement `WorkflowStatusChange` est émis à chaque transition de statut de workflow.

- Elle vérifie que certaines transitions ne sont pas autorisées.

## Tests d'enregistrement des électeurs

Cette section vérifie que l'enregistrement des électeurs est correctement géré.

- Elle vérifie que seul le owner du contrat peut ajouter des électeurs.

- Elle vérifie que l'ajout d'électeurs n'est possible que lorsque le statut de workflow est "RegisteringVoters".

- Elle vérifie que l'ajout d'un électeur émet un événement `VoterRegistered`.

- Elle vérifie que l'ajout d'un électeur déjà enregistré échoue.

## Tests d'enregistrement des propositions

Cette section vérifie que l'enregistrement des propositions est correctement géré.

- Elle vérifie que l'ajout d'une proposition n'est possible que lorsque le statut de workflow est "ProposalsRegistrationStarted".

- Elle vérifie que seul un électeur enregistré peut ajouter une proposition.

- Elle vérifie que l'ajout d'une proposition vide échoue.

- Elle vérifie que l'ajout d'une proposition émet un événement `ProposalRegistered`.

## Tests de vote

Cette section vérifie le bon fonctionnement du vote.

### Tests `setVote()`

- Elle vérifie qu'une erreur "You're not a voter" est renvoyée si un électeur non enregistré essaie de voter.

- Elle vérifie qu'une erreur "Voting session haven't started yet" est renvoyée si on tente de voter alors que la session de vote n'a pas encore commencé.

- Elle vérifie qu'une erreur "Proposal not found" est renvoyée si on tente de voter pour une proposition qui n'existe pas.

- Elle vérifie qu'un électeur peut voter pour une proposition existante et que cela émet un événement `Voted`.

- Elle vérifie que la propriété `hasVoted` de l'électeur est mise à `true` après avoir voté.

- Elle vérifie que la propriété `votedProposalId` de l'électeur est mise à jour avec l'ID de la proposition après avoir voté.

- Elle vérifie que le vote pour une proposition augmente le compteur de vote de cette proposition de 1.

- Elle vérifie qu'un électeur ne peut pas voter deux fois.

- Nous aurions pu faire quelques tests complémentaires pour vérifier que la winnigProposalID  est mise à jour au fur et à mesure dess votes mais dans tous les cas, le résultat final est couvert par les tests de la fonction `tallyVote()`

## Tests de comptage des votes et de résultats

### Tests `tallyVotes()`

- Elle vérifie qu'une erreur est renvoyée si un non-owner tente d'exécuter la fonction `tallyVotes()`.

- Elle vérifie qu'une erreur "Current status is not voting session ended" est renvoyée si `tallyVotes()` est appelé alors que la session de vote n'est pas terminée.

- Elle vérifie que l'appel à `tallyVotes()` par le owner réussit et émet un événement `WorkflowStatusChange` lorsque le statut de workflow est à 4 (session de vote terminée).

### Tests des résultats de `tallyVotes()`

- Elle vérifie que `tallyVotes()` met à jour l'ID de la proposition gagnante (`winningProposalID`) à l'ID de la proposition avec le maximum de votes.

- Elle vérifie que si aucun vote n'a été fait, `tallyVotes()` renvoie l'ID de la proposition GENESIS comme `winningProposalID`.

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