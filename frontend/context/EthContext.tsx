'use client'
import React, { createContext, useEffect,useLayoutEffect, useState } from "react";
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
  const [workflowStatus, setWorkflowStatus] = useState(0);  
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

  /*
   *  Get existing proposals
  */
  const getProposals = async () => {
      const proposalsFilter = contract.filters.ProposalRegistered();
      const events = await contract.queryFilter(proposalsFilter)
      console.log ('Proposals : ', events);
      
      /*
      const newProposals = await Promise.all(
        events.map(async (event) => {
          const proposalId = event.args.proposalId.toNumber();
    
          // Appel à la fonction getOneProposal pour obtenir les détails de la proposition
          const proposal = await contract.getOneProposal(proposalId);
    
          // Crée un nouvel objet de proposition
          return {
            proposalId: proposalId,
            proposalDescription: proposal.description,
            nbVote: proposal.voteCount
          };
        })
      );

      setProposals(newProposals);
      */
  }


  /*
   *  Get existing voters
  */
  const getVoters = async () => {
    /*
    const votersFilter = contract.filters.VoterRegistered();
    const events = await contract.queryFilter(votersFilter)
    console.log ('Voters : ', events);
  
    const newVoters = await Promise.all(
      events.map(async (event) => {
        const voterAddress = event.args.voterAddress;
  
        // Appel à la fonction getOneProposal pour obtenir les détails de la proposition
        const voter = await contract.getVoter(voterAddress)
  
        // Crée un nouvel objet de proposition
        return {
          address: event.args.voterAddress,
          isRegistered: voter.isRegistered,
          hasVoted: voter.hasVoted,
          votedProposalId:voter.voteProposalId
        };
      })
    )
      */
  }

  /*
   * Manage all contract events
  */
  const handleContractEvents = async ()=>  {

    contract.on("VoterRegistered", (voterAddress) => {
      console.log('VoterRegistered event : ',voterAddress);
      // TODO ajout d'un voter à une liste en state
    });
    contract.on("WorkflowStatusChange", (previousStatus,newStatus) => {
      console.log('WorkflowStatusChange event : ',previousStatus,newStatus);
      // MAJ du status de workflow
      setWorkflowStatus(newStatus);
    });
    contract.on("ProposalRegistered", (proposalId) => {
      console.log('ProposalRegistered event : ', proposalId);
      //ajout d'une proposal à une liste en state
      //TODO recup l'objet proposal
      proposals.push({proposalId : proposalId, proposalDescription: 'TODO', nbVote :'TODO'})
      setProposals(proposals)
    });
    contract.on("Voted", (voter, proposalId) => {
      console.log('Voted event : ', voter, proposalId);
      // à voir ce qu'on fait  de cet evenement
    });
  }; 

  const removeHandledEvents = async () => {
    contract.removeAllListeners("VoterRegistered")
    contract.removeAllListeners("WorkflowStatusChange")
    contract.removeAllListeners("ProposalRegistered")
    contract.removeAllListeners("Voted")
  }


  useLayoutEffect(() => {
    if (checkEthereumExists()) {
      ethereum.on("accountsChanged", getConnectedAccounts);
      getConnectedAccounts();
      ethereum.on('chainChanged', (chainId) => setChainId(chainId));
      ethereum.request({ method: "eth_chainId" }).then((chainId) => {
        setChainId(chainId)
      });
      console.log({isOwner, account})
      getProposals()
      getVoters()
      handleContractEvents()
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
  return (
    <EthContext.Provider value={{ account, connectWallet, chainId, isOwner, proposals, voters, state, error }}>
      {children}
    </EthContext.Provider>
  );
};
