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
    Text
  } from '@chakra-ui/react'
  import {getProposals,addProposal} from '@/utils/proposal'

 export const ProposalList = () => {
    const { account, contract } = useContext(EthContext);
    const [proposals, setProposals] = useState([]);
    const [proposalDescription, setProposalDescription] = useState('');

    useEffect(() => {
        const fetchProposals = async () => {
          if (account && account.length !== 0) {
            const proposals = await getProposals(account, contract);
            setProposals(proposals);
          }
        };
        fetchProposals();
    }, [account]);

    const voteForProposal = async () => {
        alert('vote for a proposal')
    }

    console.log ('ProposalList - proposals : ', proposals)

    return (
    <Box p='5'>
        <Heading size='xl'>Proposals Registration</Heading>
        <Box p='5'>
            <Textarea 
                placeholder='Here is your proposal description' 
                id="proposalDescription" 
                onChange={(e) => setProposalDescription(e.target.value)}/>
                <Button colorScheme='teal' variant='outline' onClick={addProposal(account,contract,proposalDescription)}>
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