'use client'
import React from 'react';
import Header from '@/components/Header';
import Main from '@/components/Main';
import Footer from '@/components/Footer';
import { Box } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box minHeight="100vh" w='80%' p='5' display="flex" flexDirection="column">
      <Header />
      <Box flex="100%" p='5'>
        <Main />
      </Box>
      <Box>
        <Footer />
      </Box>
    </Box>
  );
}
