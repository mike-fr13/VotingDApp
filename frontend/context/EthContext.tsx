"use client";
import React, { createContext, useEffect, useState } from "react";
import { Contract, ContractInterface, ethers } from "ethers";
import votingABI from "@/utils/abi";
import { redirect } from "next/navigation";
import { Voting } from "@/types/ethers-contracts";
import { useToast } from "@chakra-ui/react";
import { Voter } from '@/types/Voter'


//TODO passer en variabel envt
const votingContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const { ethereum } = (typeof window !== "undefined" ? window : {}) as {
  ethereum: any;
};
const ethereumWindow = (window as unknown as any)
  .ethereum as import("ethers").providers.ExternalProvider;
const provider = new ethers.providers.Web3Provider(ethereumWindow);

const contract = new ethers.Contract(
  votingContractAddress,
  votingABI,
  provider
) as Voting;

const contractWithSigner = contract.connect(provider.getSigner());

type EthContextType = {
  account: string;
  connectWallet: () => void;
  chainId: string;
  isOwner: boolean;
  isVoter : boolean;
  contractWithSigner: Voting;
};

export const EthContext = createContext<EthContextType>(null);

export const EthProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState("")
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isVoter, setIsVoter] = useState<boolean>(false);
  const toast = useToast();

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

  
  function  getConnectedAccounts() {
    ethereum.request({ method: "eth_accounts" })
      .then((accounts) => {
        setAccount(accounts[0]);
      })
      .catch((error) => {
        console.log ('getConnectedAccounts - error :', error.message);
        toast({
          title: "Error",
          description: error.message.slice(0, 500) + "...",
          status: "error",
        });
      });
  };
  

  function connectWallet() {
    if (checkEthereumExists()) {contract
      ethereum.request({ method: "eth_requestAccounts" })
        .then((accounts) => {
          setAccount(accounts[0]);
          console.log('connectWallet - account : ', accounts);
        })
        .catch((err) => {
          if (err.code === 4001) {
            toast({
              title: "Error",
              description: 'Please connect to Metamask'.slice(0, 500) + "...",
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
  };
  
  const removeHandledContractEvents = async () => {
    contract.removeAllListeners("VoterRegistered")
    contract.removeAllListeners("WorkflowStatusChange")
    contract.removeAllListeners("ProposalRegistered")
    contract.removeAllListeners("Voted")
  }

  const handleAccountEvents = async ()=>  {
    ethereum.on("accountsChanged", getConnectedAccounts);
    ethereum.on('chainChanged', (chainId) => setChainId(chainId));
  }

  const removeHandledAccountEvents = async ()=>  {
    ethereum.removeAllListeners("accountsChanged");
    ethereum.removeAllListeners('chainChanged');

  }

  useEffect(() => {
    if (checkEthereumExists()) {
      getConnectedAccounts();
      ethereum.request({ method: "eth_chainId" }).then((chainId) => {setChainId(chainId)});
      handleAccountEvents()
      console.log('useLayoutEffect[] - {isOwner, account} : ' , {isOwner, account})
    }
    return () => {
      if (checkEthereumExists()) {
        removeHandledAccountEvents();
      }
      removeHandledContractEvents();
    };
  }, []);


  useEffect(() => {
    const getOwner = async () => {
      console.log(contract, "contract");
      const ownerAddress = await contract.owner();
      return ownerAddress;
    };

    const checkIsVoterRegistered = async () => {
      console.log(contractWithSigner, "contract");
      const myVoter : Voter = await contractWithSigner.getVoter(account);
      return(myVoter.isRegistered)
    };

    if (account) {
      getOwner().then((ownerAddress) => {
        console.log('useEffect[account] - ownerAddress : ', ownerAddress )
        if(ethers.utils.getAddress(ownerAddress) === ethers.utils.getAddress(account)){
          setIsOwner(true)
        } else {
          setIsOwner(false);
        }
      })

      checkIsVoterRegistered()
        .then((isVoterRegistered) => {
          setIsVoter(isVoterRegistered)
          console.log('useEffect[account] - isVoterRegistered : ', isVoterRegistered )
        })
        .catch((error) => {
          setIsVoter(false)
          console.log('useEffect[account] - isVoterRegistered - error: ')
        })
    }
  }, [account])

  
  return (
    <EthContext.Provider value={{ account, chainId, connectWallet, isOwner, isVoter, contractWithSigner}}>
      {children}
    </EthContext.Provider>
  );
};
