"use client";
import { Proposal } from "@/types/Proposal";
import { BigNumber, ethers } from "ethers";
import React, { createContext, useContext, useEffect, useState } from "react";
import { EthContext } from "./EthContext";


type EventContextType = {};

export const EventContext = createContext<EventContextType>(null);

export const EventProvider = ({ children }) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [votersAddress, setVotersAddress] = useState<string[]>([]);
  const [votes, setVotes] = useState<
    { voter: string; proposalId: BigNumber }[]
  >([]);
  const { provider, account, contract, contractWithSigner, setIsVoter, isVoter } =
    useContext(EthContext);

  useEffect(() => {
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
          console.log("ProposalRegistered", proposal);
          const newProposal: Proposal = {
            proposalId,
            proposalDescription: proposal.description,
            nbVote: proposal.voteCount,
          };
          setProposals((prevState) => [...prevState, newProposal]);
        });
      });
    }

    () => {
      contract.removeAllListeners("ProposalRegistered");
    };
  }, [votersAddress, account, isVoter]);

  useEffect(() => {
    const votersFilter = contract.filters.VoterRegistered();
    contract.queryFilter(votersFilter).then((events) => {
      setVotersAddress(events.map((event) => event.args.voterAddress));
    });

    contract.on("VoterRegistered", (voterAddress) => {
      setVotersAddress((prevState) => [...prevState, voterAddress]);
    });

    () => {
      contract.removeAllListeners("VoterRegistered");
    };
  }, []);

  useEffect(() => {
    const voteFilter = contract.filters.Voted();

    contract.queryFilter(voteFilter).then((events) => {
      setVotes(
        events.map((event) => ({
          voter: event.args.voter,
          proposalId: event.args.proposalId,
        }))
      );
    });

    contract.on("Voted", (voter, proposalId) => {
      setVotes((prevState) => [...prevState, { voter, proposalId }]);
    });

    () => {
      contract.removeAllListeners("Voted");
    };
  }, []);

  console.log(votes, "votes");
  console.log(proposals, "proposals");

  return (
    <EventContext.Provider
      value={{
        proposals,
        votes,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);
