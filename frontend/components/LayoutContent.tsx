"use client";

import { useWallet } from "../context/WalletContext";
import BottomNav from "../components/BottomNav";
import Navbar from "../components/Navbar";
import { usePathname } from "next/navigation";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const { account } = useWallet();
    const pathname = usePathname();
    const isLandingPage = pathname === "/";

    return (
        <>
            {!isLandingPage && <Navbar />}
            <div className={`${!isLandingPage ? "pt-16" : ""} ${account ? "pb-20" : ""}`}>{children}</div>
            {account && <BottomNav />}
        </>
    );
}
