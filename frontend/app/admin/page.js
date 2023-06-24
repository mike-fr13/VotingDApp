'use client'
import React from 'react';
import Header from '@/components/Header';
import Main from '@/components/Main';
import Footer from '@/components/Footer';
import { Button } from '@chakra-ui/react';
import Link from 'next/link';
import { EthContext } from '@/context/EthContext';
import { useContext } from 'react';
import StatusSwitcher from "@/components/WorkflowStatus/StatusSwitcher";
import { Box, Stack } from "@chakra-ui/react";

const admin = () => {
  const { isOwner} = useContext(EthContext);
  return (
    isOwner ? (
      <Box minHeight="100vh" w='80%' p='5' display="flex" flexDirection="column">
        <Header />
        <Stack>
          <StatusSwitcher />
        </Stack>
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

export default admin;
