"use client";
import { Proposal } from "@/types/Proposal";
import { Voter } from "@/types/Voter";
import { Voting } from "@/types/ethers-contracts";
import votingABI from "@/utils/abi";
import { BigNumber, ethers } from "ethers";
import React, { createContext, useContext, useEffect, useState } from "react";
import { EthContext } from "./EthContext";

const votingContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
type EventContextType = {};

export const EventContext = createContext<EventContextType>(null);

export const EventProvider = ({ children }) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [votersAddress, setVotersAddress] = useState<string[]>([]);
  const [votes, setVotes] = useState<
    { voter: string; proposalId: BigNumber }[]
  >([]);
  const { provider, account, contractWithSigner, setIsVoter, isVoter } =
    useContext(EthContext);
    
 /*
  const { ethereum } = (typeof window !== "undefined" ? window : {}) as {
    ethereum: any;
  };
  if (!ethereum) return null;
  const ethereumWindow = !!window
    ? ((window as unknown as any)
        .ethereum as import("ethers").providers.ExternalProvider)
    : null;
  const provider = new ethers.providers.Web3Provider(ethereumWindow);
  */

  const contract = new ethers.Contract(
    votingContractAddress,
    votingABI,
    provider
  ) as Voting;

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
