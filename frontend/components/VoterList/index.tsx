import { EventContext } from "@/context/EventContext";
import { List, ListItem, Stack, Text } from "@chakra-ui/react";
import React, { useContext } from "react";

export default function VotersList() {
  const { votersAddress } = useContext(EventContext);
  return (
    <Stack
      sx={{
        border: "grey solid 1px",
        width: 550,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
      }}
    >
      <Text fontSize={"1xl"} fontWeight={"bold"}>
        Address currently Registered
      </Text>
      <List>
        {votersAddress.map((voterAddress) => (
          <ListItem>{voterAddress}</ListItem>
        ))}
      </List>
    </Stack>
  );
}
