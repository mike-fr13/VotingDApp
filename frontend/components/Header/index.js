"use client";
import React from "react";
import MetamaskButton from "../MetamaskButton/index";
import AdminButton from "../AdminButton";
import { Flex, Spacer } from "@chakra-ui/react";

export const Header = () => {
  return (
    <Flex width={"100%"}>
      <AdminButton />
      <Spacer />
      <MetamaskButton />
    </Flex>
  );
};

export default Header;
