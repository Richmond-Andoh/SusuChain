"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "../context/WalletContext";
import OnboardingCarousel from "../components/OnboardingCarousel";
import LandingPage from "../components/LandingPage";

export default function Home() {
  const { account, isWrongNetwork } = useWallet();
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem("susu_onboarding_complete");
    if (hasCompletedOnboarding) {
      setShowOnboarding(false);
    }
    setMounted(true);
  }, []);

  // Redirect to dashboard if connected
  useEffect(() => {
    if (account && !isWrongNetwork) {
      router.push("/dashboard");
    }
  }, [account, isWrongNetwork, router]);

  const handleOnboardingComplete = () => {
    localStorage.setItem("susu_onboarding_complete", "true");
    setShowOnboarding(false);
  };

  const handleResetTutorial = () => {
    localStorage.removeItem("susu_onboarding_complete");
    setShowOnboarding(true);
  };

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans overflow-hidden">
      {showOnboarding ? (
        <div className="flex-1 w-full animate-in fade-in duration-500">
          <OnboardingCarousel onComplete={handleOnboardingComplete} />
        </div>
      ) : (
        <div className="flex-1 animate-in fade-in slide-in-from-right-10 duration-500">
          <LandingPage onResetTutorial={handleResetTutorial} />
        </div>
      )}
    </main>
  );
}
