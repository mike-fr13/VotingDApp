'use client'
import React, { createContext, useEffect,useLayoutEffect, useState } from "react";
import { Contract, ContractInterface, ethers } from "ethers";
import votingABI from "@/utils/abi";
import {useToast} from "@chakra-ui/react";



//TODO passer en variable envt
const votingContractAddress='0x5FbDB2315678afecb367f032d93F642f64180aa3';
const { ethereum } = (typeof window !== "undefined" ? window : {}) as { ethereum: any };
const ethereumWindow = (window as unknown as any).ethereum as import('ethers').providers.ExternalProvider;
const provider = new ethers.providers.Web3Provider(ethereumWindow)
const votingContract = new ethers.Contract(votingContractAddress, votingABI, provider)
const contractWithSigner = votingContract.connect(provider.getSigner());

export const EthContext = createContext(null);

export const EthProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState("")
  const [contract, setcontract] = useState(votingContract);  
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [proposals, setProposals] = useState([]);  
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
  
  /*
   * Manage all contract events
  */
  const handleContractEvents = async ()=>  {

    contract.on("VoterRegistered", (voterAddress) => {
      console.log('VoterRegistered event : ',voterAddress);
      // TODO ajout d'un voter à une liste en state
      proposals.push({address: 'TODO', isRegistered: false, hasVoted: false, votedProposalId:0})
    });
    /*
    contract.on("WorkflowStatusChange", (previousStatus,newStatus) => {
      console.log('WorkflowStatusChange event : ',previousStatus,newStatus);
      // MAJ du status de workflow
      setWorkflowStatus(newStatus);
    });
    */
    contract.on("ProposalRegistered", (proposalId) => {
      console.log('ProposalRegistered event : ', proposalId);
      //ajout d'une proposal à une liste en state
      //TODO recup l'objet proposal

      const newProp = contractWithSigner
              .getOneProposal(proposalId)
              .then((proposal) => ({
                proposalId: proposalId,
                proposalDescription: proposal.description,
                nbVote: proposal.voteCount,
              }))

      proposals.push(newProp)
      setProposals(proposals)
    });
    contract.on("Voted", (voter, proposalId) => {
      console.log('Voted event : ', voter, proposalId);
      // à voir ce qu'on fait  de cet evenement
    });
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

  useLayoutEffect(() => {
    if (checkEthereumExists()) {
      getConnectedAccounts();
      ethereum.request({ method: "eth_chainId" }).then((chainId) => {setChainId(chainId)});
      handleAccountEvents()
      handleContractEvents()
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
      const ownerAddress = await contract.owner()
      return ownerAddress
    }

    if(account){
      getOwner().then((ownerAddress) => {
        console.log('useEffect[account] - ownerAddress : ', ownerAddress )
        if(ethers.utils.getAddress(ownerAddress) === ethers.utils.getAddress(account)){
          setIsOwner(true)
        } else {
          setIsOwner(false)
        }
      })
    }
  }, [account])
  return (
    <EthContext.Provider value={{ account, chainId, isOwner, proposals, contract, contractWithSigner}}>
      {children}
    </EthContext.Provider>
  );
};
