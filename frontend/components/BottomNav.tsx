"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PiggyBank, Wallet } from "lucide-react";

export default function BottomNav() {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-2xl shadow-indigo-500/10 pointer-events-auto flex items-center gap-8">
                <Link
                    href="/dashboard"
                    className={`relative p-2 transition-all duration-300 group ${isActive("/dashboard")
                        ? "text-cyan-400"
                        : "text-zinc-500 hover:text-white"
                        }`}
                >
                    <LayoutDashboard size={24} className={`transition-transform duration-300 ${isActive("/dashboard") ? "scale-110" : "group-hover:scale-110"}`} />
                    {isActive("/dashboard") && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                    )}
                </Link>

                <Link
                    href="/deposit"
                    className={`relative p-2 transition-all duration-300 group ${isActive("/deposit")
                        ? "text-purple-400"
                        : "text-zinc-500 hover:text-white"
                        }`}
                >
                    <PiggyBank size={24} className={`transition-transform duration-300 ${isActive("/deposit") ? "scale-110" : "group-hover:scale-110"}`} />
                    {isActive("/deposit") && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-400 rounded-full shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
                    )}
                </Link>

                <Link
                    href="/withdraw"
                    className={`relative p-2 transition-all duration-300 group ${isActive("/withdraw")
                        ? "text-amber-400"
                        : "text-zinc-500 hover:text-white"
                        }`}
                >
                    <Wallet size={24} className={`transition-transform duration-300 ${isActive("/withdraw") ? "scale-110" : "group-hover:scale-110"}`} />
                    {isActive("/withdraw") && (
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-400 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                    )}
                </Link>
            </div>
        </div>
    );
}
