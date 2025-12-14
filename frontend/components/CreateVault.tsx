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
        <div className="w-full max-w-lg mx-auto transform hover:scale-[1.01] transition-all duration-300">
            <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-purple-600 to-indigo-600 rounded-[2rem] blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />

                <div className="relative bg-black/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                            <Target className="w-7 h-7 text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white tracking-tight">
                                Create Vault
                            </h2>
                            <p className="text-zinc-400 text-sm">Initialize your decentralized savings journey</p>
                        </div>
                    </div>

                    <form onSubmit={handleCreate} className="space-y-8">
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-zinc-300 ml-1">
                                SAvings Goal (ETH)
                            </label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="text-zinc-500 font-mono">Ξ</span>
                                </div>
                                <input
                                    type="number"
                                    step="0.0001"
                                    value={targetAmount}
                                    onChange={(e) => setTargetAmount(e.target.value)}
                                    placeholder="1.0"
                                    className="w-full pl-10 pr-16 py-4 bg-zinc-900/50 border border-zinc-700/50 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all font-mono text-xl"
                                    disabled={loading}
                                />
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <span className="text-cyan-500 font-bold text-sm bg-cyan-500/10 px-2 py-1 rounded-md">ETH</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-500/5 p-5 rounded-2xl flex gap-4 items-start border border-amber-500/20">
                            <Lock className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-zinc-300 leading-relaxed">
                                <span className="font-semibold text-amber-400">Smart Lock Protocol:</span> Your funds will be cryptographically secured until the target is met. Zero-access policy ensures enforcing discipline.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 px-6 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 relative overflow-hidden group/btn"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                            {loading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Deploying Vault...</span>
                                </>
                            ) : (
                                <>
                                    <span className="relative z-10">Initialize Vault</span>
                                    <ArrowRight className="w-5 h-5 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
