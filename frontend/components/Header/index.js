import React from 'react'
import MetamaskButton from '../MetamaskButton/index';
import { Box } from '@chakra-ui/react';

export const Header = () => {
  return (
    <Box display="flex" alignSelf="end" justifyContent="space-between">
        <MetamaskButton/>
    </Box>
  )
}

export default Header