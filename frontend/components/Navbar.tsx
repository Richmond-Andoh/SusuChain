"use client";

import { useWallet } from "../context/WalletContext";
import { LogOut, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { account, disconnectWallet } = useWallet();
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

            {account && (
                <button
                    onClick={handleDisconnect}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                    <LogOut size={16} />
                    <span>Disconnect</span>
                </button>
            )}
        </nav>
    );
}
