"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "../../context/WalletContext";
import Deposit from "../../components/Deposit";

export default function DepositPage() {
    const { account, provider, loading } = useWallet();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !account) {
            router.push("/");
        }
    }, [account, loading, router]);

    if (loading || !account || !provider) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <span className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <main className="relative min-h-screen flex flex-col items-center p-4 sm:p-6 font-sans overflow-hidden">
            {/* Background Image & Effects */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40"
                    style={{ backgroundImage: "url('/hero-grid.jpg')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black pointer-events-none" />
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none mix-blend-overlay" />
            </div>

            <div className="relative z-10 w-full max-w-lg space-y-6 mt-16 sm:mt-24 animate-fade-in-up">
                <Deposit
                    provider={provider}
                    onSuccess={() => router.push("/dashboard")}
                />
            </div>
        </main>
    );
}
