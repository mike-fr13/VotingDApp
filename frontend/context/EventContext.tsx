"use client";
import { Proposal } from "@/types/Proposal";
import { BigNumber, ethers } from "ethers";
import React, { createContext, useContext, useEffect, useState } from "react";
import { EthContext } from "./EthContext";
import { WorkflowStatus } from "@/types/ethers-contracts/Voting";
import { Voter } from "@/types/Voter";

type EventContextType = {
  proposals: Proposal[];
  votes: Map<string, BigNumber>;
  currentWorkflowStatus: WorkflowStatus;
  votersAddress: string[];
  winningProposalId: number;
};

export const EventContext = createContext<EventContextType>(null);

export const EventProvider = ({ children }) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [votersAddress, setVotersAddress] = useState<string[]>([]);
  const [votes, setVotes] = useState<Map<string, BigNumber>>(new Map());
  const [currentWorkflowStatus, setCurrentWorkflowStatus] =
    useState<WorkflowStatus>();
  const [winningProposalId, setWinningProposalId] = useState<number>(null);
  const {
    provider,
    account,
    contract,
    contractWithSigner,
    setIsVoter,
    isVoter,
  } = useContext(EthContext);

  useEffect(() => {
    if (!account) return;
    const isVoter = votersAddress.find(
      (value) =>
        ethers.utils.getAddress(value) === ethers.utils.getAddress(account)
    );
    setIsVoter(!!isVoter);
  }, [votersAddress, account]);

  useEffect(() => {
    const proposalsFilter = contract.filters.ProposalRegistered();
    const proposalsIds = contract
      .queryFilter(proposalsFilter)
      .then((events) => {
        return events.map((event) => event.args.proposalId);
      });

    if (!!isVoter) {
      proposalsIds.then((ids) =>
        Promise.all(ids.map((id) => contractWithSigner.getOneProposal(id)))
          .then((proposals) => {
            const proposalsWithId: Proposal[] = proposals.map(
              (proposal, index) => ({
                proposalId: ids[index],
                proposalDescription: proposal.description,
                nbVote: proposal.voteCount,
              })
            );
            setProposals(proposalsWithId);
          })
          .catch((err) => console.log(err))
      );

      contract.on("ProposalRegistered", (proposalId) => {
        console.log("ProposalRegisteredListener");
        contractWithSigner.getOneProposal(proposalId).then((proposal) => {
          const newProposal: Proposal = {
            proposalId,
            proposalDescription: proposal.description,
            nbVote: proposal.voteCount,
          };
          setProposals((prevState) => [...prevState, newProposal]);
        });
      });
    }

    return () => {
      contract.removeAllListeners("ProposalRegistered");
    };
  }, [votersAddress, account, isVoter, votes]);

  useEffect(() => {
    const votersFilter = contract.filters.VoterRegistered();
    contract.queryFilter(votersFilter).then((events) => {
      setVotersAddress(events.map((event) => event.args.voterAddress));
    });

    contract.on("VoterRegistered", (voterAddress) => {
      setVotersAddress((prevState) => {
        if (prevState.includes(voterAddress)) return prevState;
        return [...prevState, voterAddress];
      });
    });

    return () => {
      contract.removeAllListeners("VoterRegistered");
    };
  }, []);

  useEffect(() => {
    const voteFilter = contract.filters.Voted();

    contract.queryFilter(voteFilter).then((events) => {
      events.forEach((event) => {
        const voter = event.args.voter;
        const proposalId = event.args.proposalId;

        setVotes((prevVotes) =>
          prevVotes.set(ethers.utils.getAddress(voter), proposalId)
        );
        console.log("new voter : ", voter, " - ", proposalId);
        console.log("votes : ", votes);
      });
    });

    contract.on("Voted", (voter, proposalId) => {
      setVotes((prevVotes) =>
        new Map(prevVotes).set(ethers.utils.getAddress(voter), proposalId)
      );
      contractWithSigner.winningProposalID().then((id) => {
        setWinningProposalId(id.toNumber());
      });
    });

    return () => {
      contract.removeAllListeners("Voted");
    };
  }, []);

  useEffect(() => {
    contractWithSigner
      .workflowStatus()
      .then((status) => setCurrentWorkflowStatus(status));

    contract.on("WorkflowStatusChange", (_, newStatus) => {
      console.log("WorkflowStatusChange", newStatus);
      setCurrentWorkflowStatus(newStatus);
    });

    return () => {
      contract.removeAllListeners("WorkflowStatusChange");
    };
  }, []);

  useEffect(() => {
    contractWithSigner.winningProposalID().then((id) => {
      setWinningProposalId(id.toNumber());
    });

    contract.on("WorkflowStatusChange", (_, newStatus) => {
      if (newStatus === WorkflowStatus.VotesTallied) {
        contractWithSigner.winningProposalID().then((id) => {
          setWinningProposalId(id.toNumber());
        });
      }
    });

    return () => {
      contract.removeAllListeners("WorkflowStatusChange");
    };
  }, []);

  return (
    <EventContext.Provider
      value={{
        proposals,
        votes,
        currentWorkflowStatus,
        votersAddress,
        winningProposalId,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);
