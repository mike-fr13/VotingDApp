'use client'
import React, { createContext, useEffect, useState } from "react";
import {ethers} from "ethers";
import votingABI from "@/utils/abi";
import {redirect} from 'next/navigation'
import {useToastHook} from "@/components/Toast";


//TODO passer en variabel envt
const votingContractAddress='0x5FbDB2315678afecb367f032d93F642f64180aa3';
const { ethereum } = (typeof window !== "undefined" ? window : {}) as { ethereum: any };
const ethereumWindow = (window as unknown as any).ethereum as import('ethers').providers.ExternalProvider;
const provider = new ethers.providers.Web3Provider(ethereumWindow)
const contract = new ethers.Contract(votingContractAddress, votingABI, provider)

export const EthContext = createContext(null);

export const EthProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");
  const [chainId, setChainId] = useState("")
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [proposals, setProposals] = useState([]);  
  const [voters, setVoters] = useState([]);  
  const [state, newToast] = useToastHook();  


  const checkEthereumExists = () => {
    if (!ethereum) { 
      setError("Please Install MetaMask.");
      return false;
    }
    return true;
  };

  const getConnectedAccounts = async () => {
    setError("");
    try {
      const accounts = await ethereum.request({
        method: "eth_accounts",
      });
      console.log(accounts);
      setAccount(accounts[0]);
    } catch (err) {
      setError(err.message);
    }
  };

  const connectWallet = async () => {
    setError("");
    if (checkEthereumExists()) {
      try {
        const accounts = await ethereum.request({ method: "eth_requestAccounts",});
        setAccount(accounts[0]);
        console.log(accounts);
      } catch (err) {
        if (err.code === 4001) {
          setError('Please connect to Metamask');
          newToast({ message: 'Please connect to Metamask', status: "error" });
        }
        else {
          setError(err.message);
          newToast({ message: err.message, status: "error" });
        }
      }
    }
  };

  const handleEvents = async ()=>  {
   
    //event VoterRegistered(address voterAddress); 
    //event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    //event ProposalRegistered(uint proposalId);
    //event Voted (address voter, uint proposalId);

    contract.on("VoterRegistered", (voterAddress) => {
      console.log(voterAddress);
      // TODO ajout d'un voter à une liste en state
    });
    contract.on("WorkflowStatusChange", (previousStatus,newStatus) => {
      console.log(previousStatus,newStatus);
      // MAJ du status de workflow
    });
    contract.on("ProposalRegistered", (proposalId) => {
      console.log(proposalId);
      // TODO ajout d'une proposal à une liste en state
    });
    contract.on("Voted", (voter, proposalId) => {
      console.log(voter, proposalId);
      // à voir ce qu'on fait  de cet evenement
    });
  }; 

  const removeHandledEvents = async () => {
    contract.removeAllListeners("VoterRegistered")
    contract.removeAllListeners("WorkflowStatusChange")
    contract.removeAllListeners("ProposalRegistered")
    contract.removeAllListeners("Voted")
  }


  useEffect(() => {
    if (checkEthereumExists()) {
      ethereum.on("accountsChanged", getConnectedAccounts);
      getConnectedAccounts();
      ethereum.on('chainChanged', (chainId) => setChainId(chainId));
      ethereum.request({ method: "eth_chainId" }).then((chainId) => {
        setChainId(chainId)
      });
      console.log({isOwner, account})
      handleEvents()
      setProposals([
        {description : "description 1", id :1},
        {description : "description 2", id :2},
        {description : "description 3", id :3},
        {description : "description 4", id :4},
        {description : "description 5", id :5},
        {description : "description 6", id :6},
      ])
    }
    return () => {
      if (checkEthereumExists()) {
        ethereum.removeListener("accountsChanged", getConnectedAccounts);
      }
      if (checkEthereumExists()) {
        ethereum.removeListener("chainChanged", (chainId) => setChainId(chainId));
      }
      removeHandledEvents();
    };
  }, []);

  useEffect(() => {
    const getOwner = async () => {
      const ownerAddress = await contract.owner()
      return ownerAddress
    }

    if(account){
      getOwner().then((ownerAddress) => {
        console.log(ownerAddress, 'ownerAddress')
        if(ethers.utils.getAddress(ownerAddress) === ethers.utils.getAddress(account)){
          setIsOwner(true)
        } else {
          setIsOwner(false)
        }
      })
    }
  }, [account])

  /*
  useEffect(() => {
    console.log(window.location.href)
    if(isOwner && window.location.href !== "http://localhost:3000/admin"){
      redirect('/admin')
    }
  }, [isOwner])
  */

  return (
    <EthContext.Provider value={{ account, connectWallet, chainId, isOwner, proposals, voters, state, error }}>
      {children}
    </EthContext.Provider>
  );
};
