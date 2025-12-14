"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../lib/constants";

import Deposit from "./Deposit";

interface DashboardProps {
    provider: ethers.BrowserProvider;
    account: string;
}

interface VaultData {
    balance: string;
    targetAmount: string;
    progress: number;
}

export default function Dashboard({ provider, account }: DashboardProps) {
    const [data, setData] = useState<VaultData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVaultData();
        // Poll for updates every 10 seconds
        const interval = setInterval(fetchVaultData, 10000);
        return () => clearInterval(interval);
    }, [provider, account]);

    const fetchVaultData = async () => {
        try {
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
            const vault = await contract.vaults(account);

            const balanceEth = ethers.formatEther(vault.balance);
            const targetEth = ethers.formatEther(vault.targetAmount);

            // Calculate progress percentage
            let progress = 0;
            if (parseFloat(targetEth) > 0) {
                progress = (parseFloat(balanceEth) / parseFloat(targetEth)) * 100;
                // Cap at 100% for visual purposes
                if (progress > 100) progress = 100;
            }

            setData({
                balance: balanceEth,
                targetAmount: targetEth,
                progress: progress
            });
        } catch (err) {
            console.error("Error fetching vault data:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full p-8 flex justify-center">
                <span className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="w-full max-w-md space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Saved</p>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {parseFloat(data.balance).toFixed(4)} <span className="text-sm font-normal text-zinc-500">ETH</span>
                    </p>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Goal</p>
                    <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                        {parseFloat(data.targetAmount).toFixed(4)} <span className="text-sm font-normal text-zinc-500">ETH</span>
                    </p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div className="flex justify-between items-end mb-2">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100">Progress</p>
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                        {data.progress.toFixed(1)}%
                    </p>
                </div>
                <div className="w-full h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-indigo-600 transition-all duration-1000 ease-out rounded-full"
                        style={{ width: `${data.progress}%` }}
                    />
                </div>
            </div>

            {/* Deposit Form */}
            <Deposit provider={provider} onSuccess={fetchVaultData} />
        </div>
    );
}
