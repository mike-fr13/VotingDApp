  const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
  const { expect } = require('chai');
  const { BigNumber } = require("ethers");

  const PropDescr1 = "Proposal description n°1";
  const PropDescr2 = "Proposal description n°1";
  const PropDescr3 = "Proposal description n°1";
  
  describe("Voting contract Tests", function () {

  
    // fixture to deploy contract
    async function deployFixture() {
      const [owner, voter1, voter2, unregisteredVoter, voter4] = await ethers.getSigners();
  
      const Voting = await ethers.getContractFactory("Voting");
      const voting = await Voting.deploy();
  
      return {voting, owner, voter1, voter2, unregisteredVoter, voter4 };
    }

    // prepare context for proposal deposit tests
    async function  prepareProposalDeposalFixture() {
      const { voting, owner, voter1, voter2, unregisteredVoter,voter4 }  = await loadFixture(deployFixture);
      await voting.connect(owner).addVoter(voter1.address);
      await voting.connect(owner).addVoter(voter2.address);
      await voting.connect(owner).addVoter(voter4.address);
      await voting.connect(owner).startProposalsRegistering();
      return { voting, owner, voter1, voter2, unregisteredVoter, voter4 };
    }

    // prepare context for Voting tests
    async function prepareVotingFixture() {
      const { voting, owner, voter1, voter2, unregisteredVoter, voter4 }  = await loadFixture(prepareProposalDeposalFixture);
      await voting.connect(voter1).addProposal(PropDescr1);
      await voting.connect(voter1).addProposal(PropDescr2);
      await voting.connect(voter2).addProposal(PropDescr3);
      await voting.connect(owner).endProposalsRegistering();
      await voting.connect(owner).startVotingSession();
      return { voting, owner, voter1, voter2, unregisteredVoter, voter4 };
    }

    // prepare context for Tally tests
    async function prepareTallyFixture(){
      const { voting, owner, voter1, voter2, unregisteredVoter, voter4 }  = await loadFixture(prepareVotingFixture);
      await voting.connect(voter1).setVote(1);
      await voting.connect(voter2).setVote(2);
      return { voting, owner, voter1, voter2, unregisteredVoter, voter4 };
    }
  
    describe("Contract Deployment", function () {
      it('should deploy the smart contract', async function() {
        const {voting, owner} = await loadFixture(deployFixture);
        let votingContractOwner = await voting.owner();
        expect(owner.address).to.be.equal(votingContractOwner);
      });
      describe ("variable initailisation", function () {
        it("Should initialise winningProposalID to 0 ", async function () {
          const { voting} = await loadFixture(deployFixture);
          expect(await voting.winningProposalID()).to.deep.equal(BigNumber.from(0));
        });

        it("Should initialise with RegisteringVoters status 0", async function () {
          const { voting} = await loadFixture(deployFixture);
          expect(await voting.workflowStatus()).to.deep.equal(BigNumber.from(0));
        });
      });
    });



    describe ("Check Workflow status change", function () {
      describe ("startProposalsRegistering() tests", function () {

        it("Should revert if not calle by owner", async function () {
          const { voting, owner, voter1} = await loadFixture(deployFixture);
          await expect(voting.connect(voter1).startProposalsRegistering()).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should change workflow status and emit WorkflowStatusChange", async function () {
          const { voting, owner} = await loadFixture(deployFixture);
          await expect(voting.connect(owner).startProposalsRegistering())
          .to.emit(voting, 'WorkflowStatusChange')
          .withArgs(0,1);
        });

        it("Should change workflowStatus to ProposalsRegistrationStarted", async function () {
          const { voting, owner} = await loadFixture(deployFixture);
          await voting.connect(owner).startProposalsRegistering();
          expect(await voting.workflowStatus()).to.deep.equal(BigNumber.from(1));
        });
      });

      describe ("endProposalsRegistering() tests", function () {

        it("Should revert if not calle by owner", async function () {
          const { voting, owner, voter1} = await loadFixture(prepareProposalDeposalFixture);
          await expect(voting.connect(voter1).endProposalsRegistering()).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should change workflow status and emit WorkflowStatusChange", async function () {
          const { voting, owner} = await loadFixture(prepareProposalDeposalFixture);
          await expect(voting.connect(owner).endProposalsRegistering())
          .to.emit(voting, 'WorkflowStatusChange')
          .withArgs(1,2);
        });

        it("Should change workflowStatus to ProposalsRegistrationEnded", async function () {
          const { voting, owner} = await loadFixture(prepareProposalDeposalFixture);
          await voting.connect(owner).endProposalsRegistering();
          expect(await voting.workflowStatus()).to.deep.equal(BigNumber.from(2));
        });
      });

      describe ("startVotingSession() tests", function () {

        it("Should revert if not calle by owner", async function () {
          const { voting, owner, voter1} = await loadFixture(prepareProposalDeposalFixture);
          await voting.connect(owner).endProposalsRegistering();
          await expect(voting.connect(voter1).startVotingSession()).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should change workflow status and emit WorkflowStatusChange", async function () {
          const { voting, owner} = await loadFixture(prepareProposalDeposalFixture);
          await voting.connect(owner).endProposalsRegistering();
          await expect(voting.connect(owner).startVotingSession())
          .to.emit(voting, 'WorkflowStatusChange')
          .withArgs(2,3);
        });

        it("Should change workflowStatus to VotingSessionStarted", async function () {
          const { voting, owner} = await loadFixture(prepareProposalDeposalFixture);
          await voting.connect(owner).endProposalsRegistering();
          await voting.connect(owner).startVotingSession();
          expect(await voting.workflowStatus()).to.deep.equal(BigNumber.from(3));
        });
      });

      describe ("endVotingSession() tests", function () {

        it("Should revert if not calle by owner", async function () {
          const { voting, owner, voter1} = await loadFixture(prepareVotingFixture);
          await expect(voting.connect(voter1).endVotingSession()).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should change workflow status and emit WorkflowStatusChange", async function () {
          const { voting, owner} = await loadFixture(prepareVotingFixture);
          await expect(voting.connect(owner).endVotingSession())
          .to.emit(voting, 'WorkflowStatusChange')
          .withArgs(3,4);
        });

        it("Should change workflowStatus to VotingSessionEnded", async function () {
          const { voting, owner} = await loadFixture(prepareVotingFixture);
          await voting.connect(owner).endVotingSession();
          expect(await voting.workflowStatus()).to.deep.equal(BigNumber.from(4));
        });
      });

      describe("Check impossible states transitions", function() {
        it('Should revert if a transition call to same state (ProposalsRegistrationStarted in our exemple)', async function() {
          const { voting} = await loadFixture(prepareProposalDeposalFixture);
          await expect(voting.startProposalsRegistering()).to.be.revertedWith("Registering proposals cant be started now");
        });

        it('Should revert endProposalsRegistering() from an unexpected state', async function() {
          const { voting} = await loadFixture(deployFixture);
          await expect(voting.endProposalsRegistering()).to.be.revertedWith("Registering proposals havent started yet")
        })

        it('Should revert startVotingSession() from an unexpected state', async function() {
          const { voting} = await loadFixture(deployFixture);
            await expect(voting.startVotingSession()).to.be.revertedWith("Registering proposals phase is not finished")
        })

        it('Should revert endVotingSession() from an unexpected state', async function() {
          const { voting} = await loadFixture(deployFixture);
            await expect(voting.endVotingSession()).to.be.revertedWith("Voting session havent started yet")
        })

      });
    });

    describe("RegisteringVoters tests", function () {
      describe("addVoter() tests", function () {
        it("Should revert if not called by contract owner ", async function () {
          const { voting, owner, voter1, voter2, unregisteredVoter } = await loadFixture(deployFixture);
          await expect(voting.connect(voter1).addVoter(unregisteredVoter.address)).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should revert if not in RegisteringVoters status", async function () {
          const { voting, owner, voter1} = await loadFixture(deployFixture);
          voting.connect(owner).startProposalsRegistering();
          await expect(voting.connect(owner).addVoter(voter1.address)).to.be.revertedWith("Voters registration is not open yet");
        });
  
        it("Should add a voter if called by contract owner and emit VoterRegistered event", async function () {
          const { voting, owner, voter1 } = await loadFixture(deployFixture);
          await expect(voting.connect(owner).addVoter(voter1.address))
              .to.emit(voting, 'VoterRegistered')
              .withArgs(voter1.address);
        });

        it("Should revert if voter allready registered", async function () {
          const { voting, owner, voter1, voter2, unregisteredVoter }  = await loadFixture(deployFixture);
          await voting.connect(owner).addVoter(unregisteredVoter.address);
          await expect(voting.connect(owner).addVoter(unregisteredVoter.address)).to.be.revertedWith("Already registered");
        });


      });

      describe("getVoter() tests", function () {
        it("Should revert if caller is not a registered Voter", async function () {
          const { voting, owner, voter1, voter2 } = await loadFixture(deployFixture);

          await voting.connect(owner).addVoter(voter2.address);
          await expect(voting.connect(voter1).getVoter(voter2.address)).to.be.revertedWith("You're not a voter");
        });

        it("Shouldn't get an empty Voter structure if caller is a registered Voter and address parameter does not belongs to a regitered voter", async function () {
          const { voting, owner, voter1, voter2 } = await loadFixture(deployFixture);

          await voting.connect(owner).addVoter(voter1.address);
          const storeData = await voting.connect(voter1).getVoter(voter2.address);

          expect(storeData).to.have.property('isRegistered');
          expect(storeData).to.have.property('hasVoted');
          expect(storeData).to.have.property('votedProposalId');

          expect(storeData.isRegistered).to.be.false;
          expect(storeData.hasVoted).to.be.false;
          expect(storeData.votedProposalId).to.be.equals(BigNumber.from(0));
        });

        it("Should get hasVoted property to false after registering a Voter", async function () {
          const { voting, owner, voter1 } = await loadFixture(deployFixture);
          await voting.connect(owner).addVoter(voter1.address);
          expect((await (voting.connect(voter1).getVoter(voter1.address))).hasVoted).to.be.false;
        });

        it("Should get votedProposalId property to 0 after registering a Voter", async function () {
          const { voting, owner, voter1 } = await loadFixture(deployFixture);
          await voting.connect(owner).addVoter(voter1.address);
          expect((await (voting.connect(voter1).getVoter(voter1.address))).votedProposalId).to.be.equals(BigNumber.from(0));
        });


        it("Should get Voter if caller is a registered Voter and address parameter belongs to a regitered voter", async function () {
          const { voting, owner, voter1} = await loadFixture(deployFixture);

          await voting.connect(owner).addVoter(voter1.address);
          const storeData = await voting.connect(voter1).getVoter(voter1.address);
          expect(storeData.isRegistered).to.be.true;;
        });
      });

    });

    describe("Registering Proposals tests", function () {
      describe("addProposal() function tests", function () {
  
        it("Should revert if not in ProposalsRegistrationStarted status", async function () {
          const { voting, owner, voter1 } = await loadFixture(deployFixture);
          await voting.connect(owner).addVoter(voter1.address);
          await expect(voting.connect(voter1).addProposal("une description de proposal")).to.be.revertedWith("Proposals are not allowed yet");
        });

        it("Should revert if called with an unregistered voter", async function () {
          const { voting, owner, voter1, voter2, unregisteredVoter } = await loadFixture(prepareProposalDeposalFixture);
          await expect(voting.connect(unregisteredVoter).addProposal("une description de proposal")).to.be.revertedWith("You're not a voter");
        });
  
        it("Should revert if called with an empty proposal", async function () {
          const { voting, owner, voter1} = await loadFixture(prepareProposalDeposalFixture);
          await expect(voting.connect(voter1).addProposal("")).to.be.revertedWith("Vous ne pouvez pas ne rien proposer");
        });

        it("Should add multiple proposal and emit ProposalRegistered event", async function () {
          const { voting, owner, voter1 } = await loadFixture(prepareProposalDeposalFixture);
          await expect(voting.connect(voter1).addProposal("first proposal description")).to.emit(voting, 'ProposalRegistered').withArgs(1);
          await expect(voting.connect(voter1).addProposal("second proposal description")).to.emit(voting, 'ProposalRegistered').withArgs(2);
        });
      });

      describe ("getOneProposal() function tests", function () {
        it("Should revert with 'You\'re not a voter' error if called with an unregistered voter", async function () {
          const { voting, owner, voter1, voter2, unregisteredVoter } = await loadFixture(prepareProposalDeposalFixture);
          await expect(voting.connect(unregisteredVoter).getOneProposal(1)).to.be.revertedWith("You're not a voter");
        });

        it("Should have a 'GENESIS' proposal at index 0 after starting Proposals Registering", async function () {
          const { voting, owner, voter1} = await loadFixture(prepareProposalDeposalFixture);
          const storedData = await voting.connect(voter1).getOneProposal(0);
          expect(storedData).to.have.property('description');
          expect(storedData).to.have.property('voteCount');

          expect(storedData.description).equal("GENESIS");
          expect(storedData.voteCount).to.be.equals(BigNumber.from(0));
        });

        it("Should be possible de retrieve an inserted proposal with corresponding description", async function () {
          const { voting, owner, voter1} = await loadFixture(prepareProposalDeposalFixture);
          voting.connect(voter1).addProposal(PropDescr1);
          const storedData2 = await voting.connect(voter1).getOneProposal(1);
          expect(storedData2.description).equal(PropDescr1);
        });

      it("Should have a proposal with 0 voteCount initialisation after a proposal registration", async function () {
        const { voting, owner, voter1} = await loadFixture(prepareProposalDeposalFixture);
        voting.connect(voter1).addProposal(PropDescr1);
        const storedData = await voting.connect(voter1).getOneProposal(1);
        expect(storedData.voteCount).to.deep.equal(BigNumber.from(0));
      });
    });
  });


    describe("Voting tests", function () {
      describe("setVote() tests", function () {
        it("Should revert with 'You\'re not a voter' error if called with an unregistered voter", async function () {
          const { voting, owner, voter1, voter2, unregisteredVoter } = await loadFixture(prepareVotingFixture);
          await expect(voting.connect(unregisteredVoter).getOneProposal(1)).to.be.revertedWith("You're not a voter");
        });

        it("Should revert with 'Voting session havent started yet' error if not in VotingSessionStarted status", async function () {
          const { voting, owner, voter1} = await loadFixture(prepareProposalDeposalFixture);
          voting.connect(voter1).addProposal(PropDescr1);
          await expect(voting.connect(voter1).setVote(1)).to.be.revertedWith("Voting session havent started yet");
        });
  
        it("Should revert with 'Proposal not found' error if trying to vote whith a proposal index that does not exist", async function () {
          const { voting, owner, voter1} = await loadFixture(prepareVotingFixture);
          await expect(voting.connect(voter1).setVote(100)).to.be.revertedWith("Proposal not found");
        });

        it("Should be able to vote for an existing proposal and emit event 'Voted'", async function () {
          const { voting, owner, voter1} = await loadFixture(prepareVotingFixture);
          await expect(voting.connect(voter1).setVote(1)).to.emit(voting, 'Voted').withArgs(voter1.address,1);
        });

        it("Should set hasVoted to true for the Voter", async function () {
          const { voting, owner, voter1 } = await loadFixture(prepareVotingFixture);
          await voting.connect(voter1).setVote(1);
          expect((await (voting.connect(voter1).getVoter(voter1.address))).hasVoted).to.be.true;
        });

        it("Should set votedProposalId property to proposalID after vote", async function () {
          const { voting, owner, voter1 } = await loadFixture(prepareVotingFixture);

          // check that proposalId is 0 before vote
          expect((await (voting.connect(voter1).getVoter(voter1.address))).votedProposalId).to.be.equals(0);

          await voting.connect(voter1).setVote(1);

          // check that proposalId is 1 after vote
          expect((await (voting.connect(voter1).getVoter(voter1.address))).votedProposalId).to.be.equals(1);

        });


        it("Should increment by 1 selected proposal", async function () {
          const { voting, owner, voter1, voter2 } = await loadFixture(prepareVotingFixture);
          expect((await voting.connect(voter1).getOneProposal(1)).voteCount).to.deep.equal(BigNumber.from(0));
          await voting.connect(voter1).setVote(1);
          expect((await voting.connect(voter1).getOneProposal(1)).voteCount).to.deep.equal(BigNumber.from(1));
          await voting.connect(voter2).setVote(1);
          expect((await voting.connect(voter1).getOneProposal(1)).voteCount).to.deep.equal(BigNumber.from(2));
        });

        it("Shouldn't be able to vote twice", async function () {
          const { voting, owner, voter1 } = await loadFixture(prepareVotingFixture);
          await voting.connect(voter1).setVote(1);
          await expect(voting.connect(voter1).setVote(2)).to.be.revertedWith("You have already voted");
        });
      });
    });

    describe("tallyVotes and result tests", function () {

      describe("tallyVotes() execution tests", function () {

        it("Should revert if not contract owner ", async function () {
          const { voting, owner, voter1} = await loadFixture(prepareTallyFixture);
          await expect(voting.connect(voter1).tallyVotes()).to.be.revertedWith("Ownable: caller is not the owner");
        });

        it("Should revert with 'Current status is not voting session ended' error if not in VotingSessionEnded status", async function () {
          const { voting, owner} = await loadFixture(prepareVotingFixture);
          await expect(voting.connect(owner).tallyVotes()).to.be.revertedWith("Current status is not voting session ended");
        });

        it("Should success and emit 'WorkflowStatusChange' if called by owner with WorkflowStatus 4", async function () {
          const { voting, owner } = await loadFixture(prepareVotingFixture);
          await voting.connect(owner).endVotingSession();
          await expect(voting.connect(owner).tallyVotes())
              .to.emit(voting, 'WorkflowStatusChange')
              .withArgs(4,5);

        });
      });

      describe("tallyVotes() results tests", function () {

        it("Should set the winningProposalID to proposal ID  with maximum vote", async function () {
          const { voting, owner, voter1, voter2, unregisteredVoter, voter4} = await loadFixture(prepareVotingFixture);
          // add a vote to proposal 2 :  Genesys => 0 vote, proposal n°1 => 1 vote, proposal n°2 => 2 votes, proposal n°3 => 0 vote
          await voting.connect(voter4).setVote(2);
          await voting.connect(owner).endVotingSession();

          // TallyVotes Call  
          await voting.connect(owner).tallyVotes();
        
          //check the winning proposal (2);
          expect(await voting.winningProposalID()).to.deep.equal(BigNumber.from(2));

        });

        it("Should return the GENESIS winningProposalID if there is no vote", async function () {
          const { voting, owner} = await loadFixture(prepareVotingFixture);
          await voting.connect(owner).endVotingSession();

          // check winningProposalID before TallyVotes Call (should be GENESIS) 
          expect(await voting.winningProposalID()).to.deep.equal(BigNumber.from(0));

          await voting.connect(owner).tallyVotes();
        
          //check the GENESIS winning proposal;
          expect(await voting.winningProposalID()).to.deep.equal(BigNumber.from(0));

        });


      });
    });
  });
  