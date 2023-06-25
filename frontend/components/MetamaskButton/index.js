import React from 'react'
import { useContext } from 'react';
import { EthContext } from '@/context/EthContext';
import { Button, Box, Text } from "@chakra-ui/react";
import { getChainName } from '@/utils/chainUtils';


export const MetamaskButton = () => {
  const { account,connectWallet,chainId,error } = useContext(EthContext);
  console.log(error);

  return (
    <Box
    display="flex"
    alignItems="center"
    background="gray.700"
    borderRadius="xl"
    py="0"
    >
        {account ? (
        <Button
            px='3'
            py='2'
            bg='green.400'
            rounded='md'
        >
            <Text color="black" fontSize="md" fontWeight="medium" mr="2">
            {getChainName(chainId)} &nbsp; - &nbsp;
            {account && `${account.slice(0, 6)}...${account.slice(account.length - 4,account.length)}`}
            </Text>
        </Button>
        ) : (
            <Button
            px='3'
            py='2'
            bg='blue.200'
            rounded='md'
            _hover={{ bg: 'blue.300' }}
            onClick={connectWallet}
            >
                Connect your Wallet
            </Button>    
        )}
    </Box>
  )
}

export default MetamaskButton