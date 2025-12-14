"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "../../context/WalletContext";
import Dashboard from "../../components/Dashboard";
import CreateVault from "../../components/CreateVault";

export default function DashboardPage() {
    const { account, provider, hasVault, refreshVaultStatus, loading } = useWallet();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !account) {
            router.push("/");
        }
    }, [account, loading, router]);

    if (loading || !account || !provider) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black">
                <span className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
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

            <div className="relative z-10 w-full max-w-4xl space-y-8 mt-8 sm:mt-12">
                {/* Only show "Dashboard" title if we are NOT on CreateVault view, or keep it consistent? 
                    Actually, let's hide the generic title and let components handle their headers for a cleaner UI. 
                */}

                {hasVault === null ? (
                    <div className="flex justify-center py-20">
                        <span className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : hasVault ? (
                    <Dashboard provider={provider} account={account} />
                ) : (
                    <div className="pt-10 animate-fade-in-up">
                        <CreateVault
                            provider={provider}
                            onSuccess={refreshVaultStatus}
                        />
                    </div>
                )}
            </div>
        </main>
    );
}
