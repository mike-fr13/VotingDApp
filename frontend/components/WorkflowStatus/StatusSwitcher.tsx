import { EthContext } from "@/context/EthContext";
import { EventContext } from "@/context/EventContext";
import { WorkflowStatus } from "@/types/ethers-contracts/Voting";
import { PromiseOrValue } from "@/types/ethers-contracts/common";
import {
  Button,
  Input,
  Spinner,
  Stack,
  Text,
  Toast,
  useToast,
} from "@chakra-ui/react";
import { Overrides, ContractTransaction } from "ethers";
import { redirect } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

export default function StatusSwitcher() {
  const { contractWithSigner, isOwner } = useContext(EthContext);
  const { currentWorkflowStatus } = useContext(EventContext);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [addressInputValue, setAddressInputValue] = useState<string>("");
  const [isSubmittingAddress, setIsSubmittingAddress] =
    useState<boolean>(false);
  const toast = useToast();

  if (!currentWorkflowStatus) {
    <Stack>
      <Spinner />
      <Text>Chargement du status</Text>
    </Stack>;
  }

  if (!isOwner) {
    return <Text>Only the owner can access this page</Text>;
  }

  function handleWorkflowChange() {
    async function submitWorkflowChange(
      contractFn: () => PromiseOrValue<ContractTransaction>
    ) {
      try {
        const tx = await contractFn();
        setIsSubmitting(true);
        const receipt = await tx.wait();
        const newStatus = await contractWithSigner.workflowStatus();
        if (newStatus === currentWorkflowStatus + 1) {
          toast({
            title: `Status changed successfully to ${WorkflowStatus[newStatus]}`,
            status: "success",
          });
        } else {
          toast({
            title: "Error",
            description: "Someting went wrong: Status not changed",
            status: "error",
          });
        }
        setIsSubmitting(false);
      } catch (error) {
        console.error(error.message);
        toast({
          title: "Error",
          description: error.message.slice(0, 500) + "...",
          status: "error",
        });
      }
    }

    switch (currentWorkflowStatus) {
      case WorkflowStatus.RegisteringVoters:
        submitWorkflowChange(contractWithSigner.startProposalsRegistering);
        break;
      case WorkflowStatus.ProposalsRegistrationStarted:
        submitWorkflowChange(contractWithSigner.endProposalsRegistering);
        break;
      case WorkflowStatus.ProposalsRegistrationEnded:
        submitWorkflowChange(contractWithSigner.startVotingSession);
        break;
      case WorkflowStatus.VotingSessionStarted:
        submitWorkflowChange(contractWithSigner.endVotingSession);
        break;
      case WorkflowStatus.VotingSessionEnded:
        submitWorkflowChange(contractWithSigner.tallyVotes);
        break;
      case WorkflowStatus.VotesTallied:
        break;
      default:
        console.warn("Unknown status");
    }
  }

  async function handleRegisterVoter() {
    console.log(addressInputValue);
    try {
      const tx = await contractWithSigner.addVoter(addressInputValue);
      setIsSubmittingAddress(true);
      const receipt = await tx.wait();
      if (receipt.status === 1) {
        toast({
          title: `Address ${addressInputValue} registered successfully`,
          status: "success",
        });
      } else {
        toast({
          title: "Error",
          description: "Someting went wrong: Address not registered",
          status: "error",
        });
      }
      setAddressInputValue("");
      setIsSubmittingAddress(false);
    } catch (error) {
      console.error(error.message);
      toast({
        title: "Error",
        description: error.message.slice(0, 500) + "...",
        status: "error",
      });
    }
  }

  return (
    <Stack>
      {currentWorkflowStatus === WorkflowStatus.RegisteringVoters && (
        <Stack flexDir="row">
          <Input
            placeholder="Address"
            value={addressInputValue}
            onChange={(e) => setAddressInputValue(e.target.value)}
          />
          <Button
            width={300}
            variant="solid"
            isLoading={isSubmittingAddress}
            onClick={handleRegisterVoter}
          >
            Register address
          </Button>
        </Stack>
      )}
      <Text>
        The current status is :{" "}
        <strong>{WorkflowStatus[currentWorkflowStatus]}</strong>
      </Text>
      {currentWorkflowStatus !== WorkflowStatus.VotesTallied && (
        <Button
          onClick={handleWorkflowChange}
          isLoading={isSubmitting}
          loadingText={`Workflow change to ${
            WorkflowStatus[currentWorkflowStatus + 1]
          } in progress`}
        >
          Change status to {WorkflowStatus[currentWorkflowStatus + 1]}
        </Button>
      )}
    </Stack>
  );
}
