'use client'
import React from 'react';
import Header from '@/components/Header';
import Head from 'next/head';
import Main from '@/components/Main';
import Footer from '@/components/Footer';
import { Box,Card,  Center,Container } from "@chakra-ui/react";

export default function Home() {
  return (
    <>
      <Head>
        <title>Voting DApp project</title>
      </Head>
      <Card minHeight="100vh" w='80%' p='5' display="flex" flexDirection="column">
        <Header/>
        <Center>
          <Container maxW='100%' centerContent>
            <Main />
          </Container>
        </Center>
        <Footer />
      </Card>
      </>
  );
}
