"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../lib/constants";

import Deposit from "./Deposit";

interface DashboardProps {
    provider: ethers.BrowserProvider;
    account: string;
}

interface VaultData {
    balance: string;
    targetAmount: string;
    totalDeposited: string;
    progress: number;
}

export default function Dashboard({ provider, account }: DashboardProps) {
    const [data, setData] = useState<VaultData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawLoading, setWithdrawLoading] = useState(false);

    useEffect(() => {
        fetchVaultData();
        // Poll for updates every 10 seconds
        const interval = setInterval(fetchVaultData, 10000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provider, account]);

    const fetchVaultData = async () => {
        try {
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
            
            // Fetch vault data
            const vault = await contract.vaults(account);
            const balanceEth = ethers.formatEther(vault.balance || 0);
            const targetEth = ethers.formatEther(vault.targetAmount || 0);

            // Fetch all Deposited events for this user to calculate total deposited
            let finalTotalDeposited = balanceEth; // Default to balance if event query fails
            try {
                const depositFilter = contract.filters.Deposited(account);
                const depositEvents = await contract.queryFilter(depositFilter);
                
                // Sum all deposit amounts from events
                let totalDepositedWei = BigInt(0);
                depositEvents.forEach((event: any) => {
                    if (event.args && event.args.amount) {
                        totalDepositedWei += event.args.amount;
                    }
                });
                
                // If events found, use the sum; otherwise use current balance
                if (depositEvents.length > 0) {
                    finalTotalDeposited = ethers.formatEther(totalDepositedWei);
                }
            } catch (eventErr) {
                // If event query fails, use current balance as total deposited
                console.warn("Could not fetch deposit events, using current balance:", eventErr);
                finalTotalDeposited = balanceEth;
            }

            // Calculate progress percentage
            let progress = 0;
            const balanceNum = parseFloat(balanceEth);
            const targetNum = parseFloat(targetEth);
            if (targetNum > 0) {
                progress = (balanceNum / targetNum) * 100;
                // Cap at 100% for visual purposes
                if (progress > 100) progress = 100;
            }

            setData({
                balance: balanceEth,
                targetAmount: targetEth,
                totalDeposited: finalTotalDeposited,
                progress: progress
            });
        } catch (err) {
            console.error("Error fetching vault data:", err);
            // Set loading to false even on error so UI can render
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const handleEmergencyWithdraw = async () => {
        setWithdrawLoading(true);

        try {
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            const tx = await contract.emergencyWithdraw();
            toast.info("Processing withdrawal...", { description: "Please confirm the transaction." });
            await tx.wait();

            toast.success("Withdrawal Successful!", { description: "Your funds have been returned." });
            fetchVaultData();
            setShowWithdrawModal(false);
        } catch (err: any) {
            console.error(err);
            toast.error("Withdrawal Failed", { description: err.reason || err.message });
        } finally {
            setWithdrawLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full p-8 flex justify-center">
                <span className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="w-full p-8 text-center">
                <p className="text-zinc-500 dark:text-zinc-400">No vault data available</p>
            </div>
        );
    }

    // Calculate amount left to reach goal
    const balanceNum = parseFloat(data.balance) || 0;
    const targetNum = parseFloat(data.targetAmount) || 0;
    const totalDepositedNum = parseFloat(data.totalDeposited) || 0;
    const amountLeft = Math.max(0, targetNum - balanceNum);

    return (
        <div className="w-full space-y-4 sm:space-y-5">
            {/* Savings Summary Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="p-5 sm:p-6">
                    <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-5 uppercase tracking-wide">
                        Savings Summary
                    </h2>
                    
                    <div className="space-y-4">
                        {/* Current Balance - Most prominent */}
                        <div>
                            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mb-1.5">
                                Current Balance
                            </p>
                            <p className="text-3xl sm:text-4xl font-bold text-indigo-600 dark:text-indigo-400 leading-tight">
                                {balanceNum.toFixed(4)}
                                <span className="text-lg sm:text-xl font-semibold text-zinc-500 dark:text-zinc-400 ml-2">
                                    ETH
                                </span>
                            </p>
                        </div>

                        {/* Grid for other metrics */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                            {/* Savings Goal */}
                            <div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
                                    Savings Goal
                                </p>
                                <p className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                                    {targetNum.toFixed(4)}
                                    <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 ml-1">
                                        ETH
                                    </span>
                                </p>
                            </div>

                            {/* Total Deposited */}
                            <div>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1.5">
                                    Total Deposited
                                </p>
                                <p className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 leading-tight">
                                    {totalDepositedNum.toFixed(4)}
                                    <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 ml-1">
                                        ETH
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Amount Left */}
                        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mb-1.5">
                                Amount Left to Reach Goal
                            </p>
                            <p className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400 leading-tight">
                                {amountLeft.toFixed(4)}
                                <span className="text-base sm:text-lg font-semibold text-zinc-500 dark:text-zinc-400 ml-2">
                                    ETH
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="p-5 sm:p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                            Progress
                        </h3>
                        <p className="text-lg sm:text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            {data.progress.toFixed(1)}%
                        </p>
                    </div>
                    <div className="w-full h-3 sm:h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-linear-to-r from-indigo-500 to-indigo-600 dark:from-indigo-500 dark:to-indigo-400 transition-all duration-1000 ease-out rounded-full shadow-sm"
                            style={{ width: `${data.progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3">
                        {parseFloat(data.balance).toFixed(4)} of {parseFloat(data.targetAmount).toFixed(4)} ETH saved
                    </p>
                </div>
            </div>

            {/* Deposit Form Card */}
            <Deposit provider={provider} onSuccess={fetchVaultData} />

            {/* Emergency Withdraw Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-red-200 dark:border-red-900/30 shadow-sm overflow-hidden">
                <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center shrink-0">
                            <AlertTriangle className="text-red-600 dark:text-red-400" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                                Emergency Withdraw
                            </h3>
                            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                                Withdraw all funds immediately. This action will close your vault.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowWithdrawModal(true)}
                        className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white font-semibold rounded-xl shadow-sm transition-all active:scale-[0.98] text-sm sm:text-base"
                    >
                        Withdraw All Funds
                    </button>
                </div>
            </div>

            {/* Withdrawal Confirmation Modal */}
            {showWithdrawModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-xl border border-zinc-200 dark:border-zinc-800 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                                Confirm Withdrawal
                            </h3>
                            <button
                                onClick={() => setShowWithdrawModal(false)}
                                disabled={withdrawLoading}
                                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 p-4 rounded-xl mb-6">
                            <p className="text-amber-800 dark:text-amber-200 text-sm font-semibold mb-1">
                                ⚠️ Warning
                            </p>
                            <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
                                This action cannot be undone. Your vault will be closed and all funds ({parseFloat(data.balance).toFixed(4)} ETH) will be returned to your wallet immediately.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowWithdrawModal(false)}
                                disabled={withdrawLoading}
                                className="flex-1 py-3 px-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold rounded-xl transition-all disabled:opacity-50 text-sm sm:text-base"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEmergencyWithdraw}
                                disabled={withdrawLoading}
                                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-sm transition-all disabled:opacity-70 flex justify-center items-center text-sm sm:text-base"
                            >
                                {withdrawLoading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    "Confirm"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
