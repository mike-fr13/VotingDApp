'use client'
import React from 'react';
import Header from '@/components/Header';
import Main from '@/components/Main';
import Footer from '@/components/Footer';
import { Box,Card,  Center,Container } from "@chakra-ui/react";

export default function Home() {
  return (
      <Card minHeight="100vh" w='80%' p='5' display="flex" flexDirection="column">
        <Header/>
        <Center>
          <Container maxW='100%' centerContent>
            <Main />
          </Container>
        </Center>
        <Footer />
      </Card>
  );
}
