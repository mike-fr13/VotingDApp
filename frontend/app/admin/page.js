"use client";
import React from "react";
import Header from "@/components/Header";
import { Button, Text } from "@chakra-ui/react";
import Link from "next/link";
import { EthContext } from "@/context/EthContext";
import { useContext } from "react";
import StatusSwitcher from "@/components/WorkflowStatus/StatusSwitcher";
import { Box, Stack } from "@chakra-ui/react";
import { EventContext, useEvents } from "@/context/EventContext";

const admin = () => {
  const { isOwner } = useContext(EthContext);
  const {} = useContext(EventContext);
  return isOwner ? (
    <Box minHeight="100vh" w="80%" p="5" display="flex" flexDirection="column">
      <Header />
      <Stack>
        <StatusSwitcher />
      </Stack>
    </Box>
  ) : (
    <Stack height={"80vh"} alignItems={"center"} justifyContent={"center"}>
      <Text fontWeight={"bold"}>
        Sorry only the owner can access this page !
      </Text>
      <Button px="3" py="2" rounded="md" bg="red.400" hover="red.600">
        <Link href="/">Get back to Home page !</Link>
      </Button>
    </Stack>
  );
};

export default admin;
