'use client'
import React, { createContext, useEffect, useState } from "react";
import {ethers} from "ethers";
import votingABI from "@/utils/abi";
import { redirect } from 'next/navigation'
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
          newToast({ message: error, status: "error" });
        }
        else {
          setError(err.message);
          newToast({ message: err.message, status: "error" });
        }
      }
    }
  };


  useEffect(() => {
    if (checkEthereumExists()) {
      ethereum.on("accountsChanged", getConnectedAccounts);
      getConnectedAccounts();
      ethereum.on('chainChanged', (chainId) => setChainId(chainId));
      ethereum.request({ method: "eth_chainId" }).then((chainId) => {
        setChainId(chainId)
      });
    }
    return () => {
      if (checkEthereumExists()) {
        ethereum.removeListener("accountsChanged", getConnectedAccounts);
      }
      if (checkEthereumExists()) {
        ethereum.removeListener("chainChanged", (chainId) => setChainId(chainId));
      }
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

  useEffect(() => {
    console.log(window.location.href)
    if(isOwner && window.location.href !== "http://localhost:3000/admin"){
      redirect('/admin')
    }
  }, [isOwner])

  console.log({isOwner, account})
  
  return (
    <EthContext.Provider value={{ account, connectWallet, chainId, error }}>
      {children}
    </EthContext.Provider>
  );
};
