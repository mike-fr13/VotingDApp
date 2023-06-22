'use client'
import { EthProvider } from "@/context/EthContext"
import { ChakraProvider } from "@chakra-ui/react"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider>
          <EthProvider>
              {children}
            </EthProvider>
        </ChakraProvider>
      </body>
    </html>
  )
}
