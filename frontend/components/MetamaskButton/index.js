import React from 'react'
import { useContext } from 'react';
import { EthContext } from '@/context/EthContext';
import { chakra } from '@chakra-ui/react';

export const MetamaskButton = () => {
  const { account, connectWallet, error } = useContext(EthContext);
  console.log(error);

  return (
    <div className="container">
        {account ? (
        <chakra.button
            px='3'
            py='2'
            bg='green.200'
            rounded='md'
        >
            {account}
        </chakra.button>
        ) : (
            <chakra.button
            px='3'
            py='2'
            bg='blue.200'
            rounded='md'
            _hover={{ bg: 'blue.300' }}
            onClick={connectWallet}
            >
                Connect your Wallet
            </chakra.button>    
        )}
        {error && <p className={`error shadow-border`}>{`Error: ${error}`}</p>}
    </div>
  )
}

export default MetamaskButton