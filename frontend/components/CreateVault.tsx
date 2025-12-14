"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { toast } from "sonner";
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
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-100">
                Start Saving
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6 text-sm">
                Create a new vault and set your savings goal.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Target Amount (ETH)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            step="0.0001"
                            value={targetAmount}
                            onChange={(e) => setTargetAmount(e.target.value)}
                            placeholder="1.0"
                            className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            disabled={loading}
                        />
                        <span className="absolute right-4 top-3 text-zinc-400 text-sm">ETH</span>
                    </div>
                </div>

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
