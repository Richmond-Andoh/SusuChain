"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../lib/constants";

interface DepositProps {
    provider: ethers.BrowserProvider;
    onSuccess: () => void;
}

export default function Deposit({ provider, onSuccess }: DepositProps) {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        try {
            if (!amount || parseFloat(amount) <= 0) {
                throw new Error("Please enter a valid amount");
            }

            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            const amountInWei = ethers.parseEther(amount);

            const tx = await contract.deposit({ value: amountInWei });
            await tx.wait();

            setSuccessMsg(`Successfully deposited ${amount} ETH!`);
            setAmount("");
            onSuccess();
        } catch (err: any) {
            console.error(err);
            setError(err.reason || err.message || "Failed to deposit");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                Add Funds
            </h3>
            <form onSubmit={handleDeposit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Amount (ETH)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            step="0.0001"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.01"
                            className="w-full px-4 py-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            disabled={loading}
                        />
                        <span className="absolute right-4 top-2 text-zinc-400 text-sm">ETH</span>
                    </div>
                </div>

                {error && (
                    <div className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                        {error}
                    </div>
                )}

                {successMsg && (
                    <div className="text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        {successMsg}
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
                            Depositing...
                        </span>
                    ) : (
                        "Deposit"
                    )}
                </button>
            </form>
        </div>
    );
}
