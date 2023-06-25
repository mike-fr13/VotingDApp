'use client'
import React from 'react'
import { useContext } from 'react'
import { EthContext } from '@/context/EthContext'
import {
    Box,
    List,
    ListItem,
    Textarea,
    Button,
    Text
  } from '@chakra-ui/react'

function ProposalList() {
    const { proposals} = useContext(EthContext);
  
    const addProposal = async () => {
        alert('add a proposal process')
    }

    const voteForProposal = async () => {
        alert('vote for a proposal')
    }

    return (
    <Box>
        <Box>
            <Textarea placeholder='Here is your proposal description' id="proposalDescription"/>
                <Button colorScheme='teal' variant='outline' onClick={addProposal}>
                    Add a proposal
                </Button>
        </Box>
        <Box>
            <Text fontSize='xl'>ProposalList</Text>
            {proposals && proposals.length === 0 ? (
                <Text fontSize='xl'>There is no proposal yet</Text>
            ) : (
                <Box>
                <Text fontSize='xl'>List of Proposals</Text>
                <List spacing={3}>
                    {proposals.map((proposal) => (
                    <ListItem key={proposal.id} id={proposal.id}>
                        {proposal.description}
                    </ListItem>
                    ))}
                </List>
                </Box>
            )}
        </Box>
    </Box>    
  )
}

export default ProposalList