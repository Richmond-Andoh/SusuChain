"use client";

import { Wallet, PiggyBank, Lock, Zap, ArrowRight, ShieldCheck, TrendingUp, ChevronDown } from "lucide-react";
import WalletConnectCard from "./WalletConnectCard";
import { useState } from "react";
import Image from "next/image";

interface LandingPageProps {
    onResetTutorial: () => void;
}

const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-zinc-800/50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
            >
                <span className="text-lg font-medium text-zinc-300 group-hover:text-cyan-400 transition-colors">
                    {question}
                </span>
                <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-48 opacity-100 pb-6" : "max-h-0 opacity-0"}`}>
                <p className="text-zinc-400 leading-relaxed">
                    {answer}
                </p>
            </div>
        </div>
    );
};

export default function LandingPage({ onResetTutorial }: LandingPageProps) {
    // The useWallet hook is not used directly in LandingPage, WalletConnectCard handles it.
    // const { connectWallet, loading, error, isWrongNetwork, switchNetwork } = useWallet();

    return (
        <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-cyan-500/30">
            {/* Modern Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 transition-all duration-300">
                <div className="max-w-7xl mx-auto flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10 shadow-lg hover:border-white/20 transition-all">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-lg border border-white/10 group cursor-pointer">
                            <Image
                                src="/logo.jpg"
                                alt="SusuChain Logo"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <span className="font-bold text-lg sm:text-xl tracking-tight text-white/90">
                            SusuChain
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
                        <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
                        <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How it Works</a>
                        <a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ</a>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-[90vh] sm:min-h-screen flex flex-col items-center justify-center text-center overflow-hidden pt-24 sm:pt-20">
                {/* Hero Background Image */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/hero-grid.jpg"
                        alt="Background Grid"
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black pointer-events-none" />
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20 pointer-events-none mix-blend-overlay" />

                    {/* Radial glow for depth */}
                    <div className="absolute inset-0 bg-radial-gradient from-cyan-500/10 via-transparent to-transparent opacity-50" />
                </div>

                <div className="relative z-10 px-4 sm:px-6 space-y-6 sm:space-y-8 max-w-5xl mx-auto w-full">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 sm:mt-8 py-1.5 sm:px-4 sm:py-2 rounded-full bg-black/40 border border-cyan-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:border-cyan-400/50 transition-colors cursor-default animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        <span className="text-[10px] sm:text-xs font-semibold text-cyan-100 tracking-wide uppercase">Live on Scroll Sepolia</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white mb-4 sm:mb-6 animate-fade-in-up delay-100 drop-shadow-2xl px-2">
                        Supercharging <br />
                        <span className="block mt-2 sm:mt-0 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient-xy pb-2">
                            Web3 Savings
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-base sm:text-xl md:text-2xl text-zinc-300 max-w-2xl mx-auto leading-relaxed font-light animate-fade-in-up delay-200 drop-shadow-md px-4">
                        The decentralized vault for your emergency fund. <br className="hidden sm:block" />
                        Fully automated, secure, and built on the mesh.
                    </p>

                    {/* CTA */}
                    <div className="pt-6 sm:pt-10 w-full flex flex-col items-center gap-4 sm:gap-6 animate-fade-in-up delay-300">
                        <div className="relative group w-full max-w-[320px] sm:max-w-md mx-auto">
                            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl blur opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                            <div className="relative bg-black/50 backdrop-blur-xl rounded-2xl p-1">
                                <WalletConnectCard />
                            </div>
                        </div>
                        <p className="text-cyan-200/60 text-xs sm:text-sm font-medium tracking-wide max-w-[250px] sm:max-w-none mx-auto leading-relaxed">
                            <span className="inline-block mr-2">•</span>
                            No email required
                            <span className="inline-block mx-2">•</span>
                            Non-custodial
                            <span className="inline-block mx-2">•</span>
                            Gas efficient
                        </p>
                    </div>
                </div>
            </section>

            {/* Container for other sections with futuristic grid background */}
            <div className="relative bg-black">
                {/* Global Grid Background for content sections */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Horizontal Lines */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                    {/* Fade overlay to make it subtle */}
                    <div className="absolute inset-0 bg-black/80" />
                    {/* Random light spots */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
                </div>

                {/* Stats / Trusted By (Optional visually) */}
                <section className="relative py-10 border-y border-zinc-800/50 bg-zinc-900/20 backdrop-blur-sm">
                    <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-3xl font-bold text-white mb-1">$0</div>
                            <div className="text-xs text-zinc-500 uppercase tracking-wider">Total Value Locked</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-1">0+</div>
                            <div className="text-xs text-zinc-500 uppercase tracking-wider">Active Savers</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-1">Scroll</div>
                            <div className="text-xs text-zinc-500 uppercase tracking-wider">Network</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white mb-1">100%</div>
                            <div className="text-xs text-zinc-500 uppercase tracking-wider">Uptime</div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section id="features" className="relative px-6 py-32">
                    <div className="max-w-6xl mx-auto relative z-10">
                        <div className="mb-20 text-center">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Why SusuChain?</h2>
                            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                                Built on the principles of trust and technology, we bring traditional saving circles to the blockchain.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Card 1 */}
                            <div className="group p-8 rounded-[2rem] bg-zinc-900/40 border border-zinc-800 backdrop-blur-sm hover:border-cyan-500/50 hover:bg-zinc-900/60 transition-all duration-300 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                                    <PiggyBank size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">Smart Micro-savings</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    Automate your savings with small, consistent deposits. Perfect for building emergency funds without feeling the pinch.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="group p-8 rounded-[2rem] bg-zinc-900/40 border border-zinc-800 backdrop-blur-sm hover:border-purple-500/50 hover:bg-zinc-900/60 transition-all duration-300 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                                    <Lock size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">Time-Locked Vaults</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    Funds are cryptographically locked until your goal is met. Eliminate the temptation to dip into your savings early.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="group p-8 rounded-[2rem] bg-zinc-900/40 border border-zinc-800 backdrop-blur-sm hover:border-amber-500/50 hover:bg-zinc-900/60 transition-all duration-300 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="w-14 h-14 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 text-amber-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                                    <Zap size={28} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white">Instant Settlement</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    Powered by Scroll&apos;s zkEVM for lightning-fast transactions and near-zero gas fees. Your money, available instantly when unlocked.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* NEW: Onboarding / How It Works Section */}
                <section id="how-it-works" className="relative px-6 py-32 border-y border-zinc-800/50 bg-black/40 backdrop-blur-sm">
                    <div className="max-w-6xl mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                            <div>
                                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Start Saving in Minutes</h2>
                                <p className="text-zinc-400 text-lg max-w-xl">
                                    We&apos;ve stripped away the complexity. No bank visits, no paperwork, just pure DeFi.
                                </p>
                            </div>
                            <button className="hidden md:flex items-center gap-2 text-cyan-400 font-medium hover:text-cyan-300 transition-colors">
                                Read the documentation <ArrowRight size={18} />
                            </button>
                        </div>

                        <div className="grid md:grid-cols-3 gap-12 relative">
                            {/* Connecting Line (Desktop) */}
                            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-zinc-800 via-cyan-900 to-zinc-800" />

                            {/* Step 1 */}
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full bg-zinc-900 border-4 border-zinc-800 flex items-center justify-center mb-8 shadow-xl text-3xl font-bold text-zinc-700 hover:border-cyan-500/50 hover:text-cyan-400 transition-all duration-300">
                                    1
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">Connect Wallet</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    Link your MetaMask or preferred Web3 wallet. We support the Scroll Sepolia network for testing.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full bg-zinc-900 border-4 border-zinc-800 flex items-center justify-center mb-8 shadow-xl text-3xl font-bold text-zinc-700 hover:border-purple-500/50 hover:text-purple-400 transition-all duration-300">
                                    2
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">Create a Vault</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    Set your savings goal and lock period. The smart contract ensures you stick to your commitment.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-full bg-zinc-900 border-4 border-zinc-800 flex items-center justify-center mb-8 shadow-xl text-3xl font-bold text-zinc-700 hover:border-amber-500/50 hover:text-amber-400 transition-all duration-300">
                                    3
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-4">Earn & Withdraw</h3>
                                <p className="text-zinc-400 leading-relaxed">
                                    Once your goal is met, withdraw your funds instantly. Complete control, zero intermediaries.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Discover Ecosystem Section */}
                <section className="relative px-6 py-24 border-b border-zinc-800/50 bg-zinc-900/20 backdrop-blur-sm">
                    <div className="max-w-6xl mx-auto relative z-10">
                        <h2 className="text-3xl font-bold text-white mb-12 text-center">Powered By</h2>
                        <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60 hover:opacity-100 transition-opacity duration-300">
                            {/* Placeholders for logos (Text for now) */}
                            <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all">
                                <Zap className="text-indigo-400" /> <span className="text-xl font-bold text-zinc-300">Scroll</span>
                            </div>
                            <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all">
                                <ShieldCheck className="text-green-400" /> <span className="text-xl font-bold text-zinc-300">OpenZeppelin</span>
                            </div>
                            <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all">
                                <TrendingUp className="text-blue-400" /> <span className="text-xl font-bold text-zinc-300">The Graph</span>
                            </div>
                            <div className="flex items-center gap-3 grayscale hover:grayscale-0 transition-all">
                                <Wallet className="text-orange-400" /> <span className="text-xl font-bold text-zinc-300">MetaMask</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="relative px-6 py-32 bg-black/40 backdrop-blur-md">
                    <div className="max-w-3xl mx-auto relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center text-white">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            <FaqItem
                                question="What is SusuChain?"
                                answer="SusuChain is a decentralized savings application that brings the traditional 'susu' savings model to the blockchain, offering transparency, security, and automation."
                            />
                            <FaqItem
                                question="Are my funds secure?"
                                answer="Yes. Your funds are locked in audited smart contracts. Only you can withdraw them once the conditions of your vault are met."
                            />
                            <FaqItem
                                question="Which network do you support?"
                                answer="Currently, we are live on the Scroll Sepolia testnet for beta testing. Mainnet launch is coming soon."
                            />
                            <FaqItem
                                question="Is there a fee to use SusuChain?"
                                answer="SusuChain charges a minimal protocol fee to maintain the platform, but gas fees on Scroll are extremely low compared to Ethereum mainnet."
                            />
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="relative py-12 px-6 border-t border-zinc-800 bg-black">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-2">
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                                <Image
                                    src="/logo.jpg"
                                    alt="SusuChain Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="font-bold text-lg tracking-tight text-white">
                                SusuChain
                            </span>
                        </div>

                        <div className="flex items-center gap-8 text-sm text-zinc-400">
                            <button onClick={onResetTutorial} className="hover:text-cyan-400 transition-colors">
                                Replay Tutorial
                            </button>
                            <a href="#" className="hover:text-cyan-400 transition-colors">
                                Twitter
                            </a>
                            <a href="#" className="hover:text-cyan-400 transition-colors">
                                GitHub
                            </a>
                            <a href="#" className="hover:text-cyan-400 transition-colors">
                                Docs
                            </a>
                        </div>

                        <p className="text-xs text-zinc-500">
                            © 2024 SusuChain Protocol. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
}
