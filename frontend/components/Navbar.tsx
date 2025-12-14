"use client";

import { useWallet } from "../context/WalletContext";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
    const { account, disconnectWallet, isWrongNetwork } = useWallet();
    const router = useRouter();

    const handleDisconnect = async () => {
        await disconnectWallet();
        router.push("/");
    };

    if (!account) return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 transition-all duration-300">
            <div className="max-w-7xl mx-auto flex items-center justify-between p-3 sm:p-4 rounded-2xl bg-black/20 backdrop-blur-md border border-white/10 shadow-lg hover:border-white/20 transition-all">
                <div className="flex items-center gap-2 sm:gap-3">
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-lg border border-white/10 cursor-pointer" onClick={() => router.push("/dashboard")}>
                        <Image
                            src="/logo.jpg"
                            alt="SusuChain Logo"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <span
                        className="font-bold text-lg sm:text-xl tracking-tight text-white/90 cursor-pointer"
                        onClick={() => router.push("/dashboard")}
                    >
                        SusuChain
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm font-bold text-zinc-100 font-mono tracking-wide">
                            {account.slice(0, 6)}...{account.slice(-4)}
                        </span>
                        <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${isWrongNetwork ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"}`} />
                            <span className="text-xs font-medium text-zinc-400">
                                {isWrongNetwork ? "Wrong Network" : "Scroll Sepolia"}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleDisconnect}
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                        <LogOut size={16} />
                        <span className="hidden sm:inline">Disconnect</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
