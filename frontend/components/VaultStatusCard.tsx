import { Lock, Unlock, Clock, Coins } from "lucide-react";

interface VaultStatusCardProps {
    isLocked: boolean;
    totalSaved: string;
    lastDepositTime?: number;
}

export default function VaultStatusCard({ isLocked, totalSaved, lastDepositTime }: VaultStatusCardProps) {
    const getTimeSince = (timestamp?: number) => {
        if (!timestamp) return "No deposits";
        const now = Math.floor(Date.now() / 1000);
        const diff = now - timestamp;

        if (diff < 60) return "Just now";
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    };

    return (
        <div className="bg-zinc-900/40 backdrop-blur-md border border-white/5 p-6 rounded-3xl mb-6">
            <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                Vault Overview
            </h3>

            <div className="grid grid-cols-3 gap-6">
                {/* Status */}
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                    <div className={`mb-2 p-2 rounded-xl ${isLocked ? "bg-amber-500/20 text-amber-500" : "bg-emerald-500/20 text-emerald-500"}`}>
                        {isLocked ? <Lock size={20} /> : <Unlock size={20} />}
                    </div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mb-0.5">Status</p>
                    <p className={`text-sm font-bold ${isLocked ? "text-amber-400" : "text-emerald-400"}`}>
                        {isLocked ? "Locked" : "Unlocked"}
                    </p>
                </div>

                {/* Total Saved */}
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                    <div className="mb-2 p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                        <Coins size={20} />
                    </div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mb-0.5">Total</p>
                    <p className="text-sm font-bold text-white break-all">
                        {parseFloat(totalSaved).toFixed(2)}
                    </p>
                </div>

                {/* Last Deposit */}
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                    <div className="mb-2 p-2 rounded-xl bg-purple-500/20 text-purple-400">
                        <Clock size={20} />
                    </div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mb-0.5">Activity</p>
                    <p className="text-sm font-bold text-white whitespace-nowrap">
                        {getTimeSince(lastDepositTime)}
                    </p>
                </div>
            </div>
        </div>
    );
}
