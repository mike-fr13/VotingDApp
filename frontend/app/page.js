"use client";
import React from "react";
import Header from "@/components/Header";
import Head from "next/head";
import Footer from "@/components/Footer";
import ProposalList from "@/components/ProposalList";
import { Box, Card, Center, Container, Stack } from "@chakra-ui/react";
import WorkflowStep from "@/components/WorkflowStep";

export default function Home() {
  return (
    <>
      <Head>
        <title>Voting DApp project</title>
      </Head>
      <Stack minHeight={"100vh"}>
        <Stack flex={1} w="90%" p="5" display="flex" flexDirection="column">
          <Header />
          <Center height={"100%"}>
            <Box flexDirection="column">
              <WorkflowStep />
              <Container w="100%" centerContent>
                <ProposalList />
              </Container>
            </Box>
          </Center>
        </Stack>
        <Footer />
      </Stack>
    </>
  );
}
