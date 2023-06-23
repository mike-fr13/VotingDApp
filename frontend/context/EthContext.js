'use client'
import React, { createContext, useEffect, useState } from "react";

const { ethereum } = typeof window !== "undefined" ? window : {};
export const EthContext = createContext();

export const EthProvider = ({ children }) => {
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");
  const [chainId, setChainId] = useState("");

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

        const chainId = await ethereum.request({ method: "eth_chainId",});
        setChainId(chainId);
        console.log(chainId);

      } catch (err) {
        setError(err.message);
      }
    }
  };


  const chainChanged = (_chainId) => {
    setChainId(_chainId);
    window.location.reload()
  }


  useEffect(() => {
    if (checkEthereumExists()) {
      ethereum.on("accountsChanged", getConnectedAccounts);
      //getConnectedAccounts();
    }
    return () => {
      if (checkEthereumExists()) {
        ethereum.removeListener("accountsChanged", getConnectedAccounts);
      }
    };
  }, []);

  //reload page on chain change
  useEffect(() => {
    ethereum.on('chainChanged', chainChanged);
    
    return () => {
      if (checkEthereumExists()) {
        ethereum.removeListener("chainChanged",chainChanged);
      }
    }
  }, [chainId]);


  return (
    <EthContext.Provider value={{ account, connectWallet, chainId, error }}>
      {children}
    </EthContext.Provider>
  );
};


