"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../lib/constants";

interface CreateVaultProps {
    provider: ethers.BrowserProvider;
    onSuccess: () => void;
}

export default function CreateVault({ provider, onSuccess }: CreateVaultProps) {
    const [targetAmount, setTargetAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!targetAmount || parseFloat(targetAmount) <= 0) {
                throw new Error("Please enter a valid amount");
            }

            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            const amountInWei = ethers.parseEther(targetAmount);

            const tx = await contract.createVault(amountInWei);
            await tx.wait();

            onSuccess();
        } catch (err: any) {
            console.error(err);
            setError(err.reason || err.message || "Failed to create vault");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
                Start Saving
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Savings Goal (ETH)
                    </label>
                    <input
                        type="number"
                        step="0.0001"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        placeholder="0.1"
                        className="w-full px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        disabled={loading}
                    />
                </div>

                {error && (
                    <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Creating...
                        </span>
                    ) : (
                        "Create Vault"
                    )}
                </button>
            </form>
        </div>
    );
}
