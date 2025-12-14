"use client";

import { useWallet } from "../context/WalletContext";
import BottomNav from "../components/BottomNav";
import Navbar from "../components/Navbar";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const { account } = useWallet();

    return (
        <>
            <Navbar />
            <div className={`pt-16 ${account ? "pb-20" : ""}`}>{children}</div>
            {account && <BottomNav />}
        </>
    );
}
