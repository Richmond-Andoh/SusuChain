"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PiggyBank, Wallet } from "lucide-react";

export default function BottomNav() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 pb-safe">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto">
                <Link
                    href="/dashboard"
                    className={`flex flex-col items-center gap-1 p-2 transition-colors ${isActive("/dashboard")
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                        }`}
                >
                    <LayoutDashboard size={24} />
                    <span className="text-xs font-medium">Home</span>
                </Link>

                <Link
                    href="/deposit"
                    className={`flex flex-col items-center gap-1 p-2 transition-colors ${isActive("/deposit")
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                        }`}
                >
                    <PiggyBank size={24} />
                    <span className="text-xs font-medium">Deposit</span>
                </Link>

                <Link
                    href="/withdraw"
                    className={`flex flex-col items-center gap-1 p-2 transition-colors ${isActive("/withdraw")
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                        }`}
                >
                    <Wallet size={24} />
                    <span className="text-xs font-medium">Withdraw</span>
                </Link>
            </div>
        </div>
    );
}
