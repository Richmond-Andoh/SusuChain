"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { toast } from "sonner";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../lib/constants";

interface DepositProps {
    provider: ethers.BrowserProvider;
    onSuccess: () => void;
}

export default function Deposit({ provider, onSuccess }: DepositProps) {
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

    const handleDeposit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!amount || parseFloat(amount) <= 0) {
                throw new Error("Please enter a valid amount");
            }

            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            const amountInWei = ethers.parseEther(amount);

            const tx = await contract.deposit({ value: amountInWei });
            toast.info("Processing deposit...", { description: "Please confirm the transaction." });
            await tx.wait();

            toast.success("Deposit Successful!", { description: `Added ${amount} ETH to your vault.` });
            setAmount("");
            onSuccess();
        } catch (err: any) {
            console.error(err);
            toast.error("Deposit Failed", { description: err.reason || err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
                    Add Funds
                </h3>
                <form onSubmit={handleDeposit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Amount (ETH)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                step="0.0001"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.01"
                                className="w-full px-4 py-3 pr-16 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-base"
                                disabled={loading}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                                ETH
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center active:scale-[0.98] text-sm sm:text-base"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Depositing...
                            </span>
                        ) : (
                            "Deposit"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
