"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { AlertTriangle, X, TrendingUp, ShieldCheck, Clock, Wallet, Zap, Activity, Database, Hash, ExternalLink, Copy, CheckCircle2, Target } from "lucide-react";
import { toast } from "sonner";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../lib/constants";
import Deposit from "./Deposit";
import { useWallet } from "../context/WalletContext";

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

interface NetworkStats {
    blockNumber: number;
    gasPrice: string;
    chainId: bigint;
}

interface Transaction {
    hash: string;
    amount: string;
    blockNumber: number;
    timestamp?: number;
}

export default function Dashboard({ provider, account }: DashboardProps) {
    const { refreshVaultStatus } = useWallet();
    const [data, setData] = useState<VaultData | null>(null);
    const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchVaultData();
        const interval = setInterval(fetchVaultData, 10000); // Live system updates
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [provider, account]);

    const fetchVaultData = async () => {
        try {
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

            // Parallelize fetching for speed
            const [vault, blockNum, feeData, network] = await Promise.all([
                contract.vaults(account),
                provider.getBlockNumber(),
                provider.getFeeData(),
                provider.getNetwork()
            ]);

            // Network Stats
            setNetworkStats({
                blockNumber: blockNum,
                gasPrice: ethers.formatUnits(feeData.gasPrice || 0, 'gwei'),
                chainId: network.chainId
            });

            // Vault Data
            // Access by index to be safe: 0=balance, 1=targetAmount
            const balanceEth = ethers.formatEther(vault[0] || 0);
            const targetEth = ethers.formatEther(vault[1] || 0);

            // History & Total Deposited
            let finalTotalDeposited = balanceEth;
            let txHistory: Transaction[] = [];

            try {
                const depositFilter = contract.filters.Deposited(account);
                const depositEvents = await contract.queryFilter(depositFilter);

                let totalDepositedWei = BigInt(0);

                // Process recent transactions (last 3)
                const recentEvents = depositEvents.slice(-3).reverse(); // Get last 3

                // Fetch timestamps for recent events
                txHistory = await Promise.all(recentEvents.map(async (event: any) => {
                    const block = await provider.getBlock(event.blockNumber);
                    return {
                        hash: event.transactionHash,
                        amount: ethers.formatEther(event.args.amount),
                        blockNumber: event.blockNumber,
                        timestamp: block?.timestamp
                    };
                }));

                depositEvents.forEach((event: any) => {
                    if (event.args && event.args.amount) {
                        totalDepositedWei += event.args.amount;
                    }
                });

                if (depositEvents.length > 0) {
                    finalTotalDeposited = ethers.formatEther(totalDepositedWei);
                }
            } catch (eventErr) {
                console.warn("Could not fetch events:", eventErr);
            }

            setTransactions(txHistory);

            // Progress Calc
            let progress = 0;
            const balanceNum = parseFloat(balanceEth);
            const targetNum = parseFloat(targetEth);
            if (targetNum > 0) {
                progress = (balanceNum / targetNum) * 100;
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

            // Refresh global vault status to trigger redirect to Create Page
            await refreshVaultStatus();

            setShowWithdrawModal(false);
        } catch (err: any) {
            console.error(err);
            toast.error("Withdrawal Failed", { description: err.reason || err.message });
        } finally {
            setWithdrawLoading(false);
        }
    };

    const copyAddress = () => {
        navigator.clipboard.writeText(CONTRACT_ADDRESS);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Address Copied");
    };

    if (loading) {
        return (
            <div className="w-full p-8 flex justify-center">
                <div className="flex flex-col items-center gap-4">
                    <span className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(6,182,212,0.5)]" />
                    <p className="text-cyan-500 font-mono animate-pulse">INITIALIZING UPLINK...</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const formatEth = (value: number) => value === 0 ? '0' : value.toFixed(4).replace(/\.?0+$/, '');
    const balanceNum = parseFloat(data.balance) || 0;
    const targetNum = parseFloat(data.targetAmount) || 0;
    const totalDepositedNum = parseFloat(data.totalDeposited) || 0;
    const amountLeft = Math.max(0, targetNum - balanceNum);

    return (
        <div className="w-full space-y-6 animate-fade-in-up">

            {/* Network Status Bar - New Feature */}
            {networkStats && (
                <div className="flex flex-wrap gap-3 mb-2">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-xs font-mono text-cyan-400">
                        <Activity size={12} className="animate-pulse" />
                        <span>BLOCK: {networkStats.blockNumber}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/30 border border-purple-500/20 text-xs font-mono text-purple-400">
                        <Zap size={12} />
                        <span>GAS: {parseFloat(networkStats.gasPrice).toFixed(2)} Gwei</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/30 border border-indigo-500/20 text-xs font-mono text-indigo-400">
                        <Database size={12} />
                        <span>CHAIN ID: {networkStats.chainId.toString()}</span>
                    </div>
                </div>
            )}

            {/* Main Hero Card */}
            <div className="relative group overflow-hidden rounded-[2rem]">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-purple-600/20 blur opacity-75" />
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        {/* Current Balance */}
                        <div className="relative z-10">
                            <h2 className="text-sm font-medium text-cyan-400 tracking-wider uppercase mb-2 flex items-center gap-2">
                                <Wallet size={16} /> Current Balance
                            </h2>
                            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-zinc-400 tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                {formatEth(balanceNum)} <span className="text-2xl text-zinc-600 font-thin">ETH</span>
                            </h1>
                        </div>

                        {/* Target/Goal Amount - Now Prominent */}
                        <div className="relative z-10 md:text-right">
                            <h2 className="text-sm font-medium text-purple-400 tracking-wider uppercase mb-2 flex items-center gap-2 md:justify-end">
                                <Target size={16} /> Vault Goal
                            </h2>
                            <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-purple-100 to-indigo-200 tracking-tight drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                                {formatEth(targetNum)} <span className="text-2xl text-zinc-600 font-thin">ETH</span>
                            </h1>
                        </div>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="space-y-3">
                        <div className="flex justify-between text-xs font-mono text-zinc-400 uppercase tracking-widest">
                            <span>Sequence Progress</span>
                            <div className="flex items-center gap-2">
                                <span className={data.progress >= 100 ? "text-green-400 font-bold" : "text-cyan-400"}>
                                    {data.progress.toFixed(1)}%
                                </span>
                            </div>
                        </div>
                        <div className="h-3 bg-zinc-900/80 rounded-full overflow-hidden border border-white/5 relative shadow-inner">
                            <div className="absolute top-0 bottom-0 left-0 bg-cyan-500 blur-md opacity-40 transition-all duration-1000" style={{ width: `${data.progress}%` }} />
                            <div
                                className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 transition-all duration-1000 ease-out rounded-full relative z-10"
                                style={{ width: `${data.progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Metric 1 */}
                <div className="bg-black/40 backdrop-blur-md border border-white/5 p-5 rounded-2xl hover:border-cyan-500/30 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp size={40} className="text-cyan-400" />
                    </div>
                    <div className="flex items-center gap-3 mb-2 text-zinc-400 group-hover:text-cyan-400 transition-colors">
                        <TrendingUp size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Remaining</span>
                    </div>
                    <p className="text-2xl font-bold text-white font-mono">
                        {formatEth(amountLeft)} ETH
                    </p>
                </div>

                {/* Metric 2 - Total Deposited */}
                <div className="bg-black/40 backdrop-blur-md border border-white/5 p-5 rounded-2xl hover:border-emerald-500/30 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShieldCheck size={40} className="text-emerald-400" />
                    </div>
                    <div className="flex items-center gap-3 mb-2 text-zinc-400 group-hover:text-emerald-400 transition-colors">
                        <ShieldCheck size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Total Deposited</span>
                    </div>
                    <p className="text-2xl font-bold text-white font-mono">
                        {formatEth(totalDepositedNum)} ETH
                    </p>
                </div>

                {/* Metric 3 */}
                <div className="bg-black/40 backdrop-blur-md border border-white/5 p-5 rounded-2xl hover:border-purple-500/30 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Clock size={40} className="text-purple-400" />
                    </div>
                    <div className="flex items-center gap-3 mb-2 text-zinc-400 group-hover:text-purple-400 transition-colors">
                        <Clock size={18} />
                        <span className="text-xs font-bold uppercase tracking-wider">Status Details</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.5)] animate-pulse" />
                        <p className="text-xl font-bold text-white">Active</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Deposit & Contract Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-black/30 backdrop-blur-md border border-white/10 p-1 rounded-[2rem]">
                        <Deposit provider={provider} onSuccess={fetchVaultData} />
                    </div>

                    {/* Transaction History - New Feature */}
                    <div className="bg-black/20 backdrop-blur-md border border-white/5 rounded-3xl p-6">
                        <h3 className="text-zinc-400 text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Activity size={16} /> Recent Ledger Activity
                        </h3>
                        {transactions.length > 0 ? (
                            <div className="space-y-3">
                                {transactions.map((tx) => (
                                    <div key={tx.hash} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                                                <TrendingUp size={16} />
                                            </div>
                                            <div>
                                                <p className="text-white font-mono text-sm">+{parseFloat(tx.amount).toFixed(4)} ETH</p>
                                                <p className="text-zinc-500 text-xs">Block #{tx.blockNumber}</p>
                                            </div>
                                        </div>
                                        <a
                                            href={`https://sepolia.scrollscan.com/tx/${tx.hash}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-zinc-500 hover:text-cyan-400 transition-colors"
                                        >
                                            <ExternalLink size={16} />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-zinc-600 text-sm italic py-4">No recent activity detected on the mesh.</p>
                        )}
                    </div>
                </div>

                {/* Right Column: Emergency & Contract Specs */}
                <div className="space-y-6">
                    {/* Contract Details Card - New Feature */}
                    <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-6 rounded-3xl">
                        <div className="flex items-center gap-2 mb-4 text-zinc-400">
                            <Hash size={18} />
                            <span className="text-xs font-bold uppercase tracking-wider">Smart Contract Protocol</span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-zinc-500 mb-1">Contract Address</p>
                                <div className="flex items-center gap-2 p-2 bg-black/40 rounded-lg border border-white/5 group">
                                    <code className="text-cyan-500 text-xs font-mono break-all line-clamp-1">
                                        {CONTRACT_ADDRESS}
                                    </code>
                                    <button onClick={copyAddress} className="text-zinc-500 hover:text-white transition-colors">
                                        {copied ? <CheckCircle2 size={14} className="text-green-500" /> : <Copy size={14} />}
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                                    <p className="text-[10px] text-zinc-500 uppercase">Network</p>
                                    <p className="text-zinc-300 text-sm font-semibold">Scroll</p>
                                </div>
                                <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                                    <p className="text-[10px] text-zinc-500 uppercase">Type</p>
                                    <p className="text-zinc-300 text-sm font-semibold">Sepolia</p>
                                </div>
                            </div>
                            <a
                                href={`https://sepolia.scrollscan.com/address/${CONTRACT_ADDRESS}`}
                                target="_blank"
                                rel="noreferrer"
                                className="block w-full py-2 text-center text-xs font-medium text-zinc-500 hover:text-cyan-400 border border-white/5 hover:border-cyan-500/30 rounded-lg transition-all"
                            >
                                View on Explorer
                            </a>
                        </div>
                    </div>

                    {/* Emergency Zone */}
                    <div className="bg-red-950/20 backdrop-blur-md border border-red-900/40 p-6 rounded-3xl">
                        <div className="flex items-center gap-3 mb-4 text-red-500">
                            <AlertTriangle size={20} />
                            <h3 className="text-sm font-bold uppercase tracking-wider">Danger Zone</h3>
                        </div>
                        <p className="text-red-200/60 text-xs leading-relaxed mb-6">
                            Emergency liquidation protocol. Irreversible action.
                        </p>
                        <button
                            onClick={() => setShowWithdrawModal(true)}
                            className="w-full py-3 bg-red-600/10 hover:bg-red-600/20 border border-red-500/50 text-red-500 font-bold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm group"
                        >
                            <X size={16} className="group-hover:rotate-90 transition-transform" />
                            Liquidate Vault
                        </button>
                    </div>
                </div>
            </div>

            {/* Withdrawal Confirmation Modal - Preserved */}
            {showWithdrawModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-zinc-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-white/10 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-bold text-white">
                                Confirm Withdrawal
                            </h3>
                            <button
                                onClick={() => setShowWithdrawModal(false)}
                                disabled={withdrawLoading}
                                className="text-zinc-500 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl mb-6">
                            <p className="text-red-400 text-sm font-semibold mb-1 flex items-center gap-2">
                                <AlertTriangle size={14} /> Warning
                            </p>
                            <p className="text-red-300/80 text-sm leading-relaxed">
                                This action cannot be undone. Your vault will be closed and all funds ({formatEth(balanceNum)} ETH) will be returned to your wallet immediately.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowWithdrawModal(false)}
                                disabled={withdrawLoading}
                                className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleEmergencyWithdraw}
                                disabled={withdrawLoading}
                                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl shadow-lg shadow-red-600/20 transition-all flex justify-center items-center"
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
