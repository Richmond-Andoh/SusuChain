"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { toast } from "sonner";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../lib/constants";
import { ArrowUpRight, Plus } from "lucide-react";

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
        <div className="bg-transparent rounded-[2rem]">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400 border border-indigo-500/30">
                        <Plus size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">
                            Add Funds
                        </h3>
                        <p className="text-zinc-400 text-sm">Top up your savings vault securely</p>
                    </div>
                </div>

                <form onSubmit={handleDeposit} className="space-y-6">
                    <div>
                        <div className="relative group">
                            <input
                                type="number"
                                step="0.0001"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full px-5 py-4 pr-20 rounded-xl border border-white/10 bg-black/40 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-mono text-2xl"
                                disabled={loading}
                            />
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                                <span className="text-indigo-400 font-bold bg-indigo-500/10 px-2 py-1 rounded text-sm">ETH</span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 active:scale-[0.98] group"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Depositing...
                            </span>
                        ) : (
                            <>
                                <span>Inject Liquidity</span>
                                <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-zinc-500">
                        Funds are secured by smart contract logic.
                    </p>
                </form>
            </div>
        </div>
    );
}
