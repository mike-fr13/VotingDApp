"use client";
import React from "react";
import { useState, useContext, useEffect } from "react";
import { EthContext } from "@/context/EthContext";
import { EventContext } from "@/context/EventContext";
import {
  Stack,
  StackDivider,
  Box,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Textarea,
  Button,
  Text,
  useToast,
} from "@chakra-ui/react";
import { getProposals } from "@/utils/proposal";
import { BigNumber } from "ethers";
import { Proposal } from "@/types/Proposal";
import { WorkflowStatus } from "@/types/ethers-contracts/Voting";

export const ProposalList = () => {
  const { account, isVoter, contractWithSigner } = useContext(EthContext);
  const { votes,currentWorkflowStatus,winningProposalId} = useContext(EventContext);

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [proposalInputValue, setProposalInputValue] = useState("");
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (isVoter) {
      const fetchProposals = async () => {
        if (account && account.length !== 0) {
          const proposals = await getProposals(account, contractWithSigner);
          setProposals(proposals);
        }
      };
      fetchProposals();
    }
  }, [account, isVoter]);

  useEffect(() => {
    if (isVoter) {
      contractWithSigner.on("ProposalRegistered", (proposalId) => {
        console.log("ProposalRegistered event : ", proposalId);

        const newProp = contractWithSigner
          .getOneProposal(proposalId)
          .then((proposal) => {
            const newProp: Proposal = {
              proposalId: proposalId,
              proposalDescription: proposal.description,
              nbVote: proposal.voteCount,
            };
            setProposals((previousState) => [...previousState, newProp]);
          });
      });
      contractWithSigner.on("Voted", (voterAddress) => {
        console.log(
          getProposals(account, contractWithSigner),
          "helloooooooooooo"
        );
        toast({ title: "Vote registered successfully", status: "success" });
        const proposals = getProposals(account, contractWithSigner).then(
          (allProposals) => {
            setProposals(allProposals);
          }
        );
      });
    }
    return () => {
      contractWithSigner.removeAllListeners("ProposalRegistered");
      contractWithSigner.removeAllListeners("Voted");
    };
  }, []);

  const voteForProposal = async (proposalId: BigNumber) => {
    if (isVoter) {
      setIsSubmittingVote(true);
      console.log("voteForProposal: ", proposalId);
      contractWithSigner.setVote(proposalId).finally(() => {
        setIsSubmittingVote(false);
      });
    }
  };

  async function handleAddProposal() {
    if (isVoter) {
      console.log(proposalInputValue);
      try {
        const tx = await contractWithSigner.addProposal(proposalInputValue);
        setIsSubmittingProposal(true);
        const receipt = await tx.wait();
        if (receipt.status === 1) {
          toast({
            title: `Proposal ${proposalInputValue} registered successfully`,
            status: "success",
          });
        } else {
          toast({
            title: "Error",
            description: "Someting went wrong: Proposal not registered",
            status: "error",
          });
        }
        setProposalInputValue("");
        setIsSubmittingProposal(false);
      } catch (error) {
        console.error(error.message);
        toast({
          title: "Error",
          description: error.message.slice(0, 500) + "...",
          status: "error",
        });
      }
    }
  }

  if (currentWorkflowStatus === WorkflowStatus.RegisteringVoters) {
    return (
      <Box
        display={"flex"}
        p="5"
        height={500}
        minWidth={800}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Heading size="lg">Proposal registration will open soon ! ⏳</Heading>
      </Box>
    );
  }

  return isVoter ? (
    <Box p="5" boxSize="4xl">
      {(currentWorkflowStatus===1) && (
      <Box p="5" w="100%">
        <Textarea
          placeholder="Here is your proposal description"
          value={proposalInputValue}
          onChange={(e) => setProposalInputValue(e.target.value)}
        />
        <Button
          colorScheme="teal"
          variant="outline"
          isLoading={isSubmittingProposal}
          onClick={handleAddProposal}
        >
          Add a proposal
        </Button>
      </Box>
      )}

      {/* Votes Tallied */}
      {(currentWorkflowStatus===5) && (
      <Box p="5" w="100%">
        <Textarea
          placeholder="Here is your proposal description"
          value={proposals[winningProposalId.toNumber()].proposalDescription}
        />
      </Box>
      )}

      <Box w="100%">
        {proposals && proposals.length === 0 ? (
          <Text fontSize="xl">There is no proposal yet</Text>
        ) : (
          <Card w="100%">
            <CardHeader>
              <Heading size="md">Proposals List</Heading>
            </CardHeader>
            {proposals.map((proposal, index) => (
              <CardBody key={index}>
                <Stack divider={<StackDivider />} spacing="4">

                  {(winningProposalId.toNumber() === index) ? (
                    <Box p="2" border="1px" borderColor="red.200" w="100%" borderStyle="dashed">
                  ) : (
                    <Box p="2" border="1px" borderColor="grey.200" w="100%">
                  )}
                  
                    <Heading size="xs" textTransform="uppercase">
                      Proposition n° {proposal.proposalId.toString()}
                    </Heading>
                    <Box display="flex" justifyContent="space-between">
                      <Text w="80%" pt="2" fontSize="sm" id="propDescr">
                        {proposal.proposalDescription}
                      </Text>
                      <Badge ml="1" maxHeight="20px" fontSize="0.8em" colorScheme="green">
                        {proposal.nbVote.toString()}
                        {proposal.nbVote && proposal.nbVote > BigNumber.from(1)
                          ? " votes"
                          : " vote"}
                      </Badge>
                      {(currentWorkflowStatus===2) && (
                      <Button
                        colorScheme="teal"
                        variant="outline"
                        onClick={() => voteForProposal(proposal.proposalId)}
                        isLoading={isSubmittingVote}
                      >
                        Vote
                      </Button>
                      )}
                    </Box>
                  </Box>
                </Stack>
              </CardBody>
            ))}
          </Card>
        )}
      </Box>
    </Box>
  ) : (
    <Box
      display={"flex"}
      p="5"
      height={500}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Heading size="lg">You're not a registred Voter</Heading>
    </Box>
  );
};

export default ProposalList;
