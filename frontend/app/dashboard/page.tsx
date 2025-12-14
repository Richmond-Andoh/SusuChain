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
            <div className="flex min-h-screen items-center justify-center">
                <span className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <main className="flex min-h-screen flex-col items-center p-6 bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans">
            <div className="w-full max-w-md space-y-6 mt-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>

                {hasVault === null ? (
                    <div className="flex justify-center py-8">
                        <span className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : hasVault ? (
                    <Dashboard provider={provider} account={account} />
                ) : (
                    <CreateVault
                        provider={provider}
                        onSuccess={refreshVaultStatus}
                    />
                )}
            </div>
        </main>
    );
}
