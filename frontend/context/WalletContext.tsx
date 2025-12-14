"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../lib/constants";

// Scroll Sepolia Network Config
const SCROLL_SEPOLIA_CHAIN_ID = "0x8274f"; // 534351
const SCROLL_SEPOLIA_CONFIG = {
    chainId: SCROLL_SEPOLIA_CHAIN_ID,
    chainName: "Scroll Sepolia",
    nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
    },
    rpcUrls: ["https://sepolia-rpc.scroll.io/"],
    blockExplorerUrls: ["https://sepolia.scrollscan.com/"],
};

interface WalletContextType {
    account: string | null;
    provider: ethers.BrowserProvider | null;
    loading: boolean;
    error: string | null;
    isWrongNetwork: boolean;
    hasVault: boolean | null;
    connectWallet: () => Promise<void>;
    disconnectWallet: () => Promise<void>;
    switchNetwork: () => Promise<void>;
    refreshVaultStatus: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
    const [account, setAccount] = useState<string | null>(null);
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isWrongNetwork, setIsWrongNetwork] = useState(false);
    const [hasVault, setHasVault] = useState<boolean | null>(null);

    useEffect(() => {
        checkConnection();
        if (window.ethereum) {
            window.ethereum.on("accountsChanged", handleAccountsChanged);
            window.ethereum.on("chainChanged", handleChainChanged);
        }
        return () => {
            if (window.ethereum) {
                window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
                window.ethereum.removeListener("chainChanged", handleChainChanged);
            }
        };
    }, []);

    useEffect(() => {
        if (account && provider && !isWrongNetwork) {
            refreshVaultStatus();
        }
    }, [account, provider, isWrongNetwork]);

    const checkConnection = async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                setProvider(provider);
                const accounts = await provider.listAccounts();
                if (accounts.length > 0) {
                    setAccount(accounts[0].address);
                    checkNetwork(provider);
                }
            } catch (err) {
                console.error("Error checking connection:", err);
            }
        }
    };

    const checkNetwork = async (provider: ethers.BrowserProvider) => {
        const network = await provider.getNetwork();
        if (network.chainId !== BigInt(534351)) {
            setIsWrongNetwork(true);
        } else {
            setIsWrongNetwork(false);
        }
    };

    const refreshVaultStatus = async () => {
        if (!provider || !account) return;
        try {
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
            const vault = await contract.vaults(account);
            setHasVault(vault.isLocked);
        } catch (err) {
            console.error("Error checking vault:", err);
        }
    };

    const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
            setAccount(accounts[0]);
        } else {
            setAccount(null);
            setHasVault(null);
        }
    };

    const handleChainChanged = () => {
        window.location.reload();
    };

    const connectWallet = async () => {
        setLoading(true);
        setError(null);
        if (typeof window.ethereum !== "undefined") {
            try {
                const provider = new ethers.BrowserProvider(window.ethereum);
                setProvider(provider);
                await provider.send("eth_requestAccounts", []);
                const signer = await provider.getSigner();
                setAccount(await signer.getAddress());
                await checkNetwork(provider);
            } catch (err: any) {
                setError(err.message || "Failed to connect wallet");
            } finally {
                setLoading(false);
            }
        } else {
            setError("Please install MetaMask to use this app");
            setLoading(false);
        }
    };

    const switchNetwork = async () => {
        if (typeof window.ethereum !== "undefined") {
            try {
                await window.ethereum.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: SCROLL_SEPOLIA_CHAIN_ID }],
                });
                setIsWrongNetwork(false);
            } catch (switchError: any) {
                if (switchError.code === 4902) {
                    try {
                        await window.ethereum.request({
                            method: "wallet_addEthereumChain",
                            params: [SCROLL_SEPOLIA_CONFIG],
                        });
                        setIsWrongNetwork(false);
                    } catch (addError) {
                        setError("Failed to add network");
                    }
                } else {
                    setError("Failed to switch network");
                }
            }
        }
    };

    const disconnectWallet = async () => {
        setAccount(null);
        setHasVault(null);
        setProvider(null);
        // Note: We cannot programmatically disconnect from MetaMask, 
        // but we can clear our local state to simulate a disconnect.
    };

    return (
        <WalletContext.Provider
            value={{
                account,
                provider,
                loading,
                error,
                isWrongNetwork,
                hasVault,
                connectWallet,
                disconnectWallet,
                switchNetwork,
                refreshVaultStatus,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return context;
}
