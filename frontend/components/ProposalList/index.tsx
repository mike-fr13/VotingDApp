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
import { BigNumber } from 'ethers'
import { Proposal } from '@/types/Proposal'

 export const ProposalList = () => {
    const { account, isVoter, contractWithSigner } = useContext(EthContext);
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [proposalInputValue, setProposalInputValue] = useState("");
    const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);
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
          console.log('ProposalRegistered event : ', proposalId);

          const newProp = contractWithSigner
            .getOneProposal(proposalId)
            .then((proposal) => {
              const newProp: Proposal = {
                proposalId: proposalId,
                proposalDescription: proposal.description,
                nbVote: proposal.voteCount,
              }
              setProposals((previousState) => [...previousState, newProp])

            }) 
          });
          contractWithSigner.on("Voted", (voterAddress) => {
            console.log(getProposals(account, contractWithSigner), "helloooooooooooo")
            toast({ title: 'Vote registered successfully' , status: 'success'})
            const proposals = getProposals(account, contractWithSigner)
              .then ((allProposals) => { setProposals(allProposals);});
          });
      }
      return () => {
        contractWithSigner.removeAllListeners("ProposalRegistered");
        contractWithSigner.removeAllListeners("Voted");
      };
    }, []);


    const voteForProposal = async (proposalId: BigNumber) => {
      if (isVoter) {
        console.log('voteForProposal: ', proposalId);
        contractWithSigner.setVote(proposalId)
      }
    }

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

    return (
    (isVoter)? (
      <Box p='5' boxSize="4xl">
          <Heading size='xl'>Proposals Registration</Heading>
          <Box p='5' w='100%'>
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
          <Box w='100%'>
              {proposals && proposals.length === 0 ? (
                  <Text fontSize='xl'>There is no proposal yet</Text>
              ) : (
                  <Card w='100%'>
                  <CardHeader>
                      <Heading size='md'>Proposals List</Heading>
                  </CardHeader>
                  {proposals.map((proposal, index) => (
                  <CardBody key={index}>
                      <Stack divider={<StackDivider />} spacing='4'>
                      <Box p='2' border='1px' borderColor='gray.200' w='100%'>
                          <Heading size='xs' textTransform='uppercase'>
                          Proposition n° {proposal.proposalId.toString()}
                          </Heading>
                          <Box display="flex" justifyContent='space-between'>
                          <Text w='80%' pt='2' fontSize='sm' id='propDescr'>
                              {proposal.proposalDescription}
                          </Text>
                          <Badge ml='1' fontSize='0.8em' colorScheme='green'>
                              {proposal.nbVote.toString()}{(proposal.nbVote && proposal.nbVote > BigNumber.from(1)) ? (' votes') : (' vote')}
                          </Badge>
                          <Button colorScheme='teal' variant='outline' onClick={() => voteForProposal(proposal.proposalId)}>
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
    ) : (
      <Box p='5'>
        <Heading size='xl'>You 're not a registred Voter</Heading>
      </Box>
    )
  )
}

export default ProposalList