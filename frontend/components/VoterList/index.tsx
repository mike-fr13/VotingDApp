import { EthContext } from "@/context/EthContext";
import { EventContext } from "@/context/EventContext";
import { WorkflowStatus } from "@/types/ethers-contracts/Voting";
import {MdCheckCircle} from 'react-icons/md';
import {
  Button,
  Input,
  List,
  ListIcon,
  ListItem,
  Spinner,
  Stack,
  Text,
  useToast,
  Box
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";

export default function VotersList() {
  const { votersAddress, currentWorkflowStatus } = useContext(EventContext);
  const { contractWithSigner } = useContext(EthContext);
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
    <Stack
      sx={{
        border: "grey solid 1px",
        width: 550,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
      }}
    >
      <Text fontSize={"1xl"} fontWeight={"bold"}>
        {votersAddress.length === 0
          ? "Add a register address"
          : "Address currently Registered"}
      </Text>
      <List>
        {votersAddress.map((voterAddress) => (
          <Stack display="flex" flexDirection="row">
          <ListIcon as={MdCheckCircle} color='green.500' />
          <ListItem>{voterAddress}</ListItem>
          </Stack>
        ))}
      </List>
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
    </Stack>
  );
}
