"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "../context/WalletContext";
import OnboardingCarousel from "../components/OnboardingCarousel";

export default function Home() {
  const {
    account,
    loading,
    isWrongNetwork,
    connectWallet,
  } = useWallet();
  const router = useRouter();

  // Redirect to dashboard if connected
  useEffect(() => {
    if (account && !isWrongNetwork) {
      router.push("/dashboard");
    }
  }, [account, isWrongNetwork, router]);

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans overflow-hidden">
      <div className="flex-1 flex items-center justify-center py-8">
        <OnboardingCarousel onConnect={connectWallet} loading={loading} />
      </div>
    </main>
  );
}
