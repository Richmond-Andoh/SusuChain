"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { toast } from "sonner";
import { Target, Lock, ArrowRight } from "lucide-react";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../lib/constants";

interface CreateVaultProps {
    provider: ethers.BrowserProvider;
    onSuccess: () => void;
}

export default function CreateVault({ provider, onSuccess }: CreateVaultProps) {
    const [targetAmount, setTargetAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!targetAmount || parseFloat(targetAmount) <= 0) {
                throw new Error("Please enter a valid target amount");
            }

            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            const targetWei = ethers.parseEther(targetAmount);

            const tx = await contract.createVault(targetWei);
            toast.info("Creating your vault...", { description: "Please confirm the transaction." });
            await tx.wait();

            toast.success("Vault Created!", { description: `Target set to ${targetAmount} ETH` });
            onSuccess();
        } catch (err: any) {
            console.error(err);
            toast.error("Failed to create vault", { description: err.reason || err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-indigo-500/5">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Target size={20} />
                </div>
                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                    Create Your Savings Goal
                </h2>
            </div>

            <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                Set a target amount for your vault. This helps you stay disciplined and track your progress.
            </p>

            <form onSubmit={handleCreate} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                        Target Amount (ETH)
                    </label>
                    <div className="relative group">
                        <input
                            type="number"
                            step="0.0001"
                            value={targetAmount}
                            onChange={(e) => setTargetAmount(e.target.value)}
                            placeholder="1.0"
                            className="w-full px-5 py-4 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-lg"
                            disabled={loading}
                        />
                        <span className="absolute right-5 top-4 text-zinc-400 font-medium">ETH</span>
                    </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl flex gap-3 items-start border border-amber-100 dark:border-amber-900/20">
                    <Lock className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                        <span className="font-semibold">Goal Locking:</span> Your funds will be locked in the smart contract until you reach this target. This ensures you stick to your goal.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-indigo-500/20 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                    {loading ? (
                        <>
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Creating Vault...
                        </>
                    ) : (
                        <>
                            Start Saving
                            <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
