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
  Center,
} from "@chakra-ui/react";
import { getProposals } from "@/utils/proposal";
import { BigNumber } from "ethers";
import { Proposal } from "@/types/Proposal";
import { WorkflowStatus } from "@/types/ethers-contracts/Voting";

export const ProposalList = () => {
  const { account, isVoter, contractWithSigner } = useContext(EthContext);
  const { proposals, votes, currentWorkflowStatus, winningProposalId } =
    useContext(EventContext);

  //const [proposals, setProposals] = useState<Proposal[]>([]);
  const [proposalInputValue, setProposalInputValue] = useState("");
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);
  const toast = useToast();

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
      {currentWorkflowStatus === 1 && (
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
      {currentWorkflowStatus === 5 && winningProposalId != 0 && (
        <Card w="100%" backgroundColor="green.200" p="5">
          <CardHeader>
            <Heading size="md">Winning Proposal</Heading>
          </CardHeader>
          <CardBody>
            <Heading size="xs" textTransform="uppercase">
              Proposition n° {winningProposalId}
            </Heading>
            <Text>
              {proposals?.[winningProposalId - 1]?.proposalDescription}
            </Text>
          </CardBody>
          <Stack divider={<StackDivider />} spacing="4"></Stack>
        </Card>
      )}

      {currentWorkflowStatus === 5 && winningProposalId == 0 && (
        <Card w="100%" backgroundColor="green.200" p="5">
          <CardHeader>
            <Heading size="md">No Winning proposals</Heading>
          </CardHeader>
          <CardBody>
            {proposals.length === 0 ? (
              <Heading size="xs" textTransform="uppercase">
                No proposal registered !
              </Heading>
            ) : (
              <Heading size="xs" textTransform="uppercase">
                {proposals.length === 1 ? (
                  <>No Vote on the registered proposal !</>
                ) : (
                  <>No Vote on the {proposals.length} registered proposals !</>
                )}
              </Heading>
            )}
          </CardBody>
          <Stack divider={<StackDivider />} spacing="4"></Stack>
        </Card>
      )}
      <Box w="100%">
        {proposals && proposals.length === 0 ? (
          <Text fontSize="xl">There is no proposal yet</Text>
        ) : (
          <Card w="100%">
            <CardHeader>
              <Heading size="md">Proposals List</Heading>
            </CardHeader>
            {proposals?.map((proposal, index) => (
              <CardBody key={index + 1}>
                <Stack divider={<StackDivider />} spacing="4">
                  <Box
                    p="2"
                    w="100%"
                    border={
                      currentWorkflowStatus != 5 &&
                      winningProposalId === index + 1
                        ? "3px"
                        : "0px"
                    }
                    borderColor={
                      (currentWorkflowStatus === 3 ||
                        currentWorkflowStatus === 4) &&
                      winningProposalId === index + 1
                        ? "green.600"
                        : "grey.200"
                    }
                    borderStyle={
                      (currentWorkflowStatus === 3 ||
                        currentWorkflowStatus === 4) &&
                      winningProposalId === index + 1
                        ? "dashed"
                        : "normal"
                    }
                  >
                    <Heading size="xs" textTransform="uppercase">
                      Proposition n° {proposal.proposalId.toString()}
                    </Heading>
                    <Box display="flex" justifyContent="space-between">
                      <Text w="80%" pt="2" fontSize="sm" id="propDescr">
                        {proposal.proposalDescription}
                      </Text>
                      {currentWorkflowStatus >= 3 && (
                        <Stack
                          display="flex"
                          flexDirection="column"
                          width="100px"
                        >
                          <Badge
                            ml="1"
                            p="2"
                            borderRadius="5"
                            fontSize="0.8em"
                            colorScheme="green"
                          >
                            {proposal.nbVote.toString()}
                            {proposal.nbVote &&
                            proposal.nbVote > BigNumber.from(1)
                              ? " votes"
                              : " vote"}
                          </Badge>
                          {currentWorkflowStatus >= 3 &&
                            votes.get(account)?.toNumber() === index + 1 && (
                              <Badge
                                ml="1"
                                p="2"
                                borderRadius="5"
                                fontSize="0.8em"
                                colorScheme="red"
                              >
                                Your choice
                              </Badge>
                            )}
                          {winningProposalId === index + 1 &&
                            currentWorkflowStatus != 5 && (
                              <Text fontSize="xs" color="green.800">
                                Current winning proposal
                              </Text>
                            )}
                        </Stack>
                      )}
                      {currentWorkflowStatus === 3 && !votes.has(account) && (
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
