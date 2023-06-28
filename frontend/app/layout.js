"use client";
import { EthProvider } from "@/context/EthContext";
import { EventProvider } from "@/context/EventContext";
import { ChakraProvider } from "@chakra-ui/react";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          <EthProvider>
            <EventProvider>{children}</EventProvider>
          </EthProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}
