'use client'
import React from 'react'
import { useState,useContext,useEffect } from 'react'
import { EthContext } from '@/context/EthContext'
import {
    Stack,StackDivider,
    Box,
    Badge,
    Card,CardHeader,CardBody,
    Heading,
    Textarea,
    Button,
    Text,
    useToast
  } from '@chakra-ui/react'
  import {getProposals} from '@/utils/proposal'

 export const ProposalList = () => {
    const { account, contract,contractWithSigner } = useContext(EthContext);
    const [proposals, setProposals] = useState([]);
    const [proposalInputValue, setProposalInputValue] = useState("");
    const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);
    const toast = useToast();
    
    useEffect(() => {
        const fetchProposals = async () => {
          if (account && account.length !== 0) {
            const proposals = await getProposals(account, contract);
            setProposals(proposals);
          }
        };
        fetchProposals();
    }, [account]);

    const voteForProposal = async (account, contract, proposalId) => {
        alert('vote for a proposal ', account, ' ', contract, ' ',proposalId)
    }

    async function handleAddProposal() {
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

    return (
    <Box p='5'>
        <Heading size='xl'>Proposals Registration</Heading>
        <Box p='5'>
            <Textarea 
                placeholder='Here is your proposal description' 
                value={proposalInputValue}
                onChange={(e) => setProposalInputValue(e.target.value)}/>
                <Button colorScheme='teal' variant='outline' 
                    isLoading={isSubmittingProposal}
                    onClick={handleAddProposal}>
                    Add a proposal
                </Button>
        </Box>
        <Box>
            {proposals && proposals.length === 0 ? (
                <Text fontSize='xl'>There is no proposal yet</Text>
            ) : (
                <Card>
                <CardHeader>
                    <Heading size='md'>Proposals List</Heading>
                </CardHeader>
                {proposals.map((proposal) => (
                <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
                    <Box p='2'>
                        <Heading size='xs' textTransform='uppercase'>
                        Proposition n° {proposal.proposalId.toString()}
                        </Heading>
                        <Box display="flex">
                        <Text pt='2' fontSize='sm' id='propDescr'>
                            {proposal.proposalDescription}
                        </Text>
                        <Badge ml='1' fontSize='0.8em' colorScheme='green'>
                            {proposal.nbVote.toString()}{(proposal.nbVote && proposal.nbVote > 1) ? (' votes') : (' vote')}
                        </Badge>
                        <Button colorScheme='teal' variant='outline' onClick={() => voteForProposal(account, contract, proposal.proposalId)}>
                            Vote
                        </Button>
                        </Box>
                    </Box>
                    </Stack>
                </CardBody>
                 ))}
                </Card>
            )}
        </Box>
    </Box>    
  )
}

export default ProposalList