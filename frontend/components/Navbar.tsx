"use client";

import { useWallet } from "../context/WalletContext";
import { LogOut, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { account, disconnectWallet, isWrongNetwork } = useWallet();
    const router = useRouter();

    const handleDisconnect = async () => {
        await disconnectWallet();
        router.push("/");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 z-50 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                    <Wallet size={18} />
                </div>
                <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white">
                    SusuChain
                </span>
            </div>

            {account ? (
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            {account.slice(0, 6)}...{account.slice(-4)}
                        </span>
                        <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${isWrongNetwork ? "bg-red-500" : "bg-green-500"}`} />
                            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                {isWrongNetwork ? "Wrong Network" : "Sepolia"}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleDisconnect}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <LogOut size={16} />
                        <span className="md:hidden">Disconnect</span>
                    </button>
                </div>
            ) : null}
        </nav>
    );
}
