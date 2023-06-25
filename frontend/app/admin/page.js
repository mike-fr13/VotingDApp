'use client'
import React from 'react';
import Header from '@/components/Header';
import Main from '@/components/Main';
import Footer from '@/components/Footer';
import { Box } from "@chakra-ui/react";
import { Button } from '@chakra-ui/react';
import Link from 'next/link';
import { EthContext } from '@/context/EthContext';
import { useContext } from 'react';

const admin = () => {
  const { isOwner} = useContext(EthContext);
  return (
    isOwner ? (
      <Box minHeight="100vh" w='80%' p='5' display="flex" flexDirection="column">
        <Header />
        <Box flex="100%" p='5'>
            Page d'administration 
        </Box>
        <Box>
          <Footer />
        </Box>
    </Box>
    ) : (
      <Button
            px='3'
            py='2'
            rounded='md'
            bg='red.400'
            hover='red.600'
            >
        <Link href="/">Get back to Home page !</Link>
      </Button>  
    )
  )
}

export default admin