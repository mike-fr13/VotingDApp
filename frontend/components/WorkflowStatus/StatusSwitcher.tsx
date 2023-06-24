import { EthContext } from "@/context/EthContext";
import { WorkflowStatus } from "@/types/ethers-contracts/Voting";
import { PromiseOrValue } from "@/types/ethers-contracts/common";
import { Button, Spinner, Stack, Text } from "@chakra-ui/react";
import { Overrides, ContractTransaction } from "ethers";
import React, { useContext, useEffect, useState } from "react";

export default function StatusSwitcher() {
  const { contractWithSigner } = useContext(EthContext);
  const [currentWorkflowStatus, setCurrentWorkflowStatus] = useState<
    number | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
      contractFn: () => PromiseOrValue<ContractTransaction | void>
    ) {
      try {
        const transaction = await contractFn();
        console.log(transaction);
        setIsSubmitting(true);
        contractWithSigner.on("WorkflowStatusChange", async () => {
          const newStatus = await contractWithSigner.workflowStatus();
          if (newStatus === currentWorkflowStatus + 1) {
            setCurrentWorkflowStatus(newStatus);
            setIsSubmitting(false);
            alert("Status changed successfully");
          }
        });
      } catch (error) {}
    }

    switch (currentWorkflowStatus) {
      case WorkflowStatus.RegisteringVoters:
        submitWorkflowChange(contractWithSigner.startProposalsRegistering);
        break;
      case WorkflowStatus.ProposalsRegistrationStarted:
        setIsSubmitting(true);
        contractWithSigner.endProposalsRegistering();
        break;
      case WorkflowStatus.ProposalsRegistrationEnded:
        setIsSubmitting(true);
        contractWithSigner.startVotingSession();
        break;
      case WorkflowStatus.VotingSessionStarted:
        setIsSubmitting(true);
        contractWithSigner.endVotingSession();
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
        <Button onClick={handleWorkflowChange} disabled={isSubmitting}>
          {isSubmitting && <Spinner />}
          Change status to {WorkflowStatus[currentWorkflowStatus + 1]}
        </Button>
      )}
    </Stack>
  );
}
