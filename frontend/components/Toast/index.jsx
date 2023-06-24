import { useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";

export function useToastHook() {
  const [state, setState] = useState(undefined);
  const toast = useToast();

  useEffect(() => {
    if (state) {
      const { message, status } = state;

      toast({
        title: status,
        description: message,
        status: status,
        duration: 6000,
        position: "bottom",
        isClosable: true,
      });
    }
  }, [state, toast]);

  return [state, setState];
}
