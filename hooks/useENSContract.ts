'use client'

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import type { NameRecord, EventLog } from "../app/types/contract";

const CONTRACT_ABI = [
  "function registerName(string memory name, string memory imageHash, address targetAddress) external",
  "function updateAddress(string memory name, address newAddress) external",
  "function updateImage(string memory name, string memory newImageHash) external", 
  "function transferName(string memory name, address newOwner) external",
  "function resolveName(string memory name) external view returns (address owner, address resolvedAddress, string memory imageHash, uint256 registrationTime)",
  "function isNameAvailable(string memory name) external view returns (bool available)",
  "function getNamesOwnedBy(address owner) external view returns (string[] memory names)",
  "event NameRegistered(string indexed name, address indexed owner, string imageHash)",
  "event NameUpdated(string indexed name, address indexed newAddress, string newImageHash)",
  "event NameTransferred(string indexed name, address indexed oldOwner, address indexed newOwner)"
];

const CONTRACT_ADDRESS = "0xAc17396a4Ad477aa6C2845962035B57BdbC9bdb3"; 

export const useENSContract = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState<EventLog[]>([]);
  const [ownedNames, setOwnedNames] = useState<string[]>([]);

  
  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask n\'est pas installé');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      setProvider(provider);
      setSigner(signer);
      setContract(contract);
      setAccount(accounts[0]);
      setIsConnected(true);

      // Configuration des écouteurs d'événements
      setupEventListeners(contract, accounts[0]);
      
      // Chargement des données initiales
      await loadOwnedNames(contract, accounts[0]);
      
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  }, []);

  // Configuration des écouteurs d'événements
  const setupEventListeners = useCallback((contract: ethers.Contract, userAccount: string) => {
    // Écouteur pour NameRegistered
    contract.on('NameRegistered', (name: string, owner: string, imageHash: string, event: any) => {
      const newEvent: EventLog = {
        type: 'registered',
        name,
        data: { owner, imageHash },
        timestamp: Date.now(),
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber
      };
      
      setEvents(prev => [newEvent, ...prev].slice(0, 100));
      
      if (owner.toLowerCase() === userAccount.toLowerCase()) {
        loadOwnedNames(contract, userAccount);
      }
    });

    // Écouteur pour NameUpdated
    contract.on('NameUpdated', (name: string, newAddress: string, newImageHash: string, event: any) => {
      const newEvent: EventLog = {
        type: 'updated',
        name,
        data: { newAddress, newImageHash },
        timestamp: Date.now(),
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber
      };
      
      setEvents(prev => [newEvent, ...prev].slice(0, 100));
    });

    // Écouteur pour NameTransferred
    contract.on('NameTransferred', (name: string, oldOwner: string, newOwner: string, event: any) => {
      const newEvent: EventLog = {
        type: 'transferred',
        name,
        data: { oldOwner, newOwner },
        timestamp: Date.now(),
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber
      };
      
      setEvents(prev => [newEvent, ...prev].slice(0, 100));
      
      if (oldOwner.toLowerCase() === userAccount.toLowerCase() || 
          newOwner.toLowerCase() === userAccount.toLowerCase()) {
        loadOwnedNames(contract, userAccount);
      }
    });
  }, []);

  // Chargement des noms possédés
  const loadOwnedNames = useCallback(async (contract: ethers.Contract, address: string) => {
    try {
      const names = await contract.getNamesOwnedBy(address);
      setOwnedNames(names);
    } catch (error) {
      console.error('Erreur lors du chargement des noms:', error);
    }
  }, []);

  // Enregistrer un nom
  const registerName = useCallback(async (name: string, imageHash: string, targetAddress: string) => {
    if (!contract) throw new Error('Contrat non initialisé');
    
    setIsLoading(true);
    try {
      const tx = await contract.registerName(name, imageHash, targetAddress);
      await tx.wait();
      return tx;
    } finally {
      setIsLoading(false);
    }
  }, [contract]);

  
  const updateAddress = useCallback(async (name: string, newAddress: string) => {
    if (!contract) throw new Error('Contrat non initialisé');
    
    setIsLoading(true);
    try {
      const tx = await contract.updateAddress(name, newAddress);
      await tx.wait();
      return tx;
    } finally {
      setIsLoading(false);
    }
  }, [contract]);

  // Mettre à jour l'image
  const updateImage = useCallback(async (name: string, newImageHash: string) => {
    if (!contract) throw new Error('Contrat non initialisé');
    
    setIsLoading(true);
    try {
      const tx = await contract.updateImage(name, newImageHash);
      await tx.wait();
      return tx;
    } finally {
      setIsLoading(false);
    }
  }, [contract]);

  // Transférer un nom
  const transferName = useCallback(async (name: string, newOwner: string) => {
    if (!contract) throw new Error('Contrat non initialisé');
    
    setIsLoading(true);
    try {
      const tx = await contract.transferName(name, newOwner);
      await tx.wait();
      return tx;
    } finally {
      setIsLoading(false);
    }
  }, [contract]);

  // Résoudre un nom
  const resolveName = useCallback(async (name: string): Promise<NameRecord | null> => {
    if (!contract) throw new Error('Contrat non initialisé');
    
    try {
      const [owner, resolvedAddress, imageHash, registrationTime] = await contract.resolveName(name);
      return {
        owner,
        resolvedAddress,
        imageHash,
        registrationTime: Number(registrationTime)
      };
    } catch (error: any) {
      if (error.reason?.includes('does not exist')) {
        return null;
      }
      throw error;
    }
  }, [contract]);

  // Vérifier la disponibilité
  const checkAvailability = useCallback(async (name: string): Promise<boolean> => {
    if (!contract) throw new Error('Contrat non initialisé');
    
    try {
      return await contract.isNameAvailable(name);
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      return false;
    }
  }, [contract]);

  return {
    provider,
    signer,
    contract,
    account,
    isConnected,
    isLoading,
    events,
    ownedNames,
    connectWallet,
    registerName,
    updateAddress,
    updateImage,
    transferName,
    resolveName,
    checkAvailability,
  };
};