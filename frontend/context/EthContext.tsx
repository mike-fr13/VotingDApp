"use client";
import React, { createContext, useEffect, useState } from "react";
import { Contract, ContractInterface, ethers } from "ethers";
import votingABI from "@/utils/abi";
import { Voting } from "@/types/ethers-contracts";
import { useToast } from "@chakra-ui/react";


const votingContractAddress = process.env.NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS;
console.log('process.env.NEXT_PUBLIC_VOTING_CONTRACT_ADDRESS : ',votingContractAddress);


type EthContextType = {
  provider: any;
  account: string;
  connectWallet: () => void;
  setIsVoter: (isVoter: boolean) => void;
  chainId: string;
  isOwner: boolean;
  isVoter: boolean;
  contractWithSigner: Voting;
  contract: Voting;
};

export const EthContext = createContext<EthContextType>(null);

export const EthProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState("");
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isVoter, setIsVoter] = useState<boolean>(false);
  const toast = useToast();

  const { ethereum } = (typeof window !== "undefined" ? window : {}) as {
    ethereum: any;
  };
  if (!ethereum) return null;
  const ethereumWindow = !!window
    ? ((window as unknown as any)
        .ethereum as import("ethers").providers.ExternalProvider)
    : null;
  const provider = new ethers.providers.Web3Provider(ethereumWindow);

  console.log('EthProvider  - process.env.VOTING_CONTRACT_ADDRESS : ',votingContractAddress);
  const contract = new ethers.Contract(
    votingContractAddress,
    votingABI,
    provider
  ) as Voting;

  const contractWithSigner = contract.connect(provider.getSigner());

  const checkEthereumExists = () => {
    if (!ethereum) {
      toast({
        title: "Error",
        description: "Please Install MetaMask.".slice(0, 500) + "...",
        status: "error",
      });
      return false;
    }
    return true;
  };

  function getConnectedAccounts() {
    ethereum
      .request({ method: "eth_accounts" })
      .then((accounts) => {
        setAccount(ethers.utils.getAddress(accounts[0]));
      })
      .catch((error) => {
        console.log("getConnectedAccounts - error :", error.message);
        toast({
          title: "Error",
          description: error.message.slice(0, 500) + "...",
          status: "error",
        });
      });
  }

  function connectWallet() {
    if (checkEthereumExists()) {
      contract;
      ethereum
        .request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          setAccount(ethers.utils.getAddress(accounts[0]));
          console.log("connectWallet - account : ", accounts);
        })
        .catch((err) => {
          if (err.code === 4001) {
            toast({
              title: "Error",
              description: "Please connect to Metamask".slice(0, 500) + "...",
              status: "error",
            });
          } else {
            toast({
              title: "Error",
              description: err.message.slice(0, 500) + "...",
              status: "error",
            });
          }
        });
    }
  }

  const handleAccountEvents = async () => {
    ethereum.on("accountsChanged", getConnectedAccounts);
    ethereum.on("chainChanged", (chainId) => setChainId(chainId));
  };

  const removeHandledAccountEvents = async () => {
    ethereum.removeAllListeners("accountsChanged");
    ethereum.removeAllListeners("chainChanged");
  };

  useEffect(() => {
    if (checkEthereumExists()) {
      getConnectedAccounts();
      ethereum.request({ method: "eth_chainId" }).then((chainId) => {
        setChainId(chainId);
      });
      handleAccountEvents();
      console.log("useLayoutEffect[] - {isOwner, account} : ", {
        isOwner,
        account,
      });
    }
    return () => {
      if (checkEthereumExists()) {
        removeHandledAccountEvents();
      }
    };
  }, []);

  useEffect(() => {
    const getOwner = async () => {
      console.log(contract, "contract");
      const ownerAddress = await contract.owner();
      return ownerAddress;
    };

    if (account) {
      getOwner().then((ownerAddress) => {
        console.log("useEffect[account] - ownerAddress : ", ownerAddress);
        if (
          ethers.utils.getAddress(ownerAddress) ===
          ethers.utils.getAddress(account)
        ) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
      });
    }
  }, [account]);

  return (
    <EthContext.Provider
      value={{
        provider,
        account,
        chainId,
        connectWallet,
        isOwner,
        setIsVoter,
        isVoter,
        contractWithSigner,
        contract
      }}
    >
      {children}
    </EthContext.Provider>
  );
};
