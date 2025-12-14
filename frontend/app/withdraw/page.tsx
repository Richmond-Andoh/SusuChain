"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "../../context/WalletContext";
import Withdraw from "../../components/Withdraw";

export default function WithdrawPage() {
    const { account, provider, loading, refreshVaultStatus } = useWallet();
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

    const handleSuccess = async () => {
        await refreshVaultStatus();
        router.push("/dashboard");
    };

    return (
        <main className="flex min-h-screen flex-col items-center p-6 bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans">
            <div className="w-full max-w-md space-y-6 mt-6">
                <h1 className="text-2xl font-bold">Withdraw</h1>

                <Withdraw
                    provider={provider}
                    onSuccess={handleSuccess}
                />
            </div>
        </main>
    );
}
