import { EthContext } from "@/context/EthContext";
import { WorkflowStatus } from "@/types/ethers-contracts/Voting";
import { PromiseOrValue } from "@/types/ethers-contracts/common";
import {
  Button,
  Spinner,
  Stack,
  Text,
  Toast,
  useToast,
} from "@chakra-ui/react";
import { Overrides, ContractTransaction } from "ethers";
import React, { useContext, useEffect, useState } from "react";

export default function StatusSwitcher() {
  const { contractWithSigner } = useContext(EthContext);
  const [currentWorkflowStatus, setCurrentWorkflowStatus] = useState<
    number | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const toast = useToast();

  useEffect(() => {
    const getStatus = async () => {
      const status = await contractWithSigner.workflowStatus();
      setCurrentWorkflowStatus(status);
    };
    getStatus();
  }, []);

  if (!currentWorkflowStatus) {
    <Stack>
      <Spinner />
      <Text>Chargement du status</Text>
    </Stack>;
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
          setCurrentWorkflowStatus(newStatus);
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
  return (
    <Stack>
      <Text>The current status is {WorkflowStatus[currentWorkflowStatus]}</Text>
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
