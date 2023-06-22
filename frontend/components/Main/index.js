import React from 'react'
import { Textarea } from '@chakra-ui/react'
import { Button } from '@chakra-ui/react'

import { Box, Flex } from "@chakra-ui/react"


export const Main = () => {
  return (
    <div>
      <Textarea placeholder='Here is your proposal description' id="proposalDescription"/>
      <Button colorScheme='teal' variant='outline' onClick={() => { alert('add a proposal process') }}>
        Add a proposal
      </Button>
    </div>
  )
}

export default Main