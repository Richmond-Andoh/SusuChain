"use client";

import { ArrowRight, AlertTriangle, Wallet } from "lucide-react";
import { useWallet } from "../context/WalletContext";

export default function WalletConnectCard() {
    const { connectWallet, loading, error, isWrongNetwork, switchNetwork } = useWallet();

    return (
        <div className="w-full max-w-sm mx-auto bg-white dark:bg-zinc-900/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl shadow-indigo-500/10 transform transition-all hover:scale-[1.02]">
            <div className="flex flex-col items-center gap-6 text-center">

                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <Wallet size={32} />
                </div>

                {/* Text */}
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                        Connect Your Wallet
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Link your wallet to start saving securely on the blockchain.
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="w-full p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm flex items-center gap-2 text-left">
                        <AlertTriangle size={16} className="flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Actions */}
                {isWrongNetwork ? (
                    <div className="w-full space-y-3">
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl text-sm text-amber-800 dark:text-amber-200">
                            Please switch to the Sepolia network to continue.
                        </div>
                        <button
                            onClick={switchNetwork}
                            className="w-full py-3.5 px-6 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            Switch Network
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={connectWallet}
                        disabled={loading}
                        className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Connecting...
                            </>
                        ) : (
                            <>
                                Connect Wallet
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                )}

                <p className="text-xs text-zinc-400">
                    By connecting, you agree to our Terms of Service.
                </p>
            </div>
        </div>
    );
}
