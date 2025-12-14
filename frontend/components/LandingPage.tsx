"use client";

import { Wallet, PiggyBank, Lock, Zap } from "lucide-react";
import { useWallet } from "../context/WalletContext";
import WalletConnectCard from "./WalletConnectCard";

interface LandingPageProps {
    onResetTutorial: () => void;
}

export default function LandingPage({ onResetTutorial }: LandingPageProps) {
    const { connectWallet, loading, error, isWrongNetwork, switchNetwork } = useWallet();

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-indigo-500/30">

            {/* Hero Section */}
            <section className="relative px-6 pt-20 pb-32 md:pt-32 md:pb-40 flex flex-col items-center text-center overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 bg-indigo-500/10 dark:bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 backdrop-blur-sm shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Live on Sepolia</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        Save small. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                            Stay prepared.
                        </span>
                    </h1>

                    <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
                        The decentralized micro-savings vault for your emergency fund. Secure, transparent, and always accessible when you need it.
                    </p>

                    <div className="pt-8 w-full flex justify-center">
                        <WalletConnectCard />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="px-6 py-20 bg-white dark:bg-zinc-900/50 border-y border-zinc-200 dark:border-zinc-800">
                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Feature 1 */}
                        <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-indigo-500/30 transition-all group">
                            <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                                <PiggyBank size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">Micro-savings</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                Build wealth effortlessly with small, consistent deposits. Even dust can grow into a mountain.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-indigo-500/30 transition-all group">
                            <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                                <Lock size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">Locked Security</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                Your funds are secured on-chain. No intermediaries, no hidden fees, just pure code.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-3xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 hover:border-indigo-500/30 transition-all group">
                            <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center mb-6 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                                <Zap size={28} />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">Built on Scroll</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                Experience lightning-fast transactions and minimal gas fees on the Scroll network.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                            <Wallet size={16} />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white">
                            SusuChain
                        </span>
                    </div>

                    <div className="flex items-center gap-8 text-sm text-zinc-500 dark:text-zinc-400">
                        <button onClick={onResetTutorial} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            Replay Tutorial
                        </button>
                        <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            GitHub
                        </a>
                        <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            Docs
                        </a>
                    </div>

                    <p className="text-xs text-zinc-400">
                        © 2024 SusuChain Protocol
                    </p>
                </div>
            </footer>
        </div>
    );
}
