import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { AlertTriangle, X, Award, CheckCircle2, Ticket } from "lucide-react";
import { toast } from "sonner";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../lib/constants";

interface WithdrawProps {
    provider: ethers.BrowserProvider;
    onSuccess: () => void;
    account: string;
}

export default function Withdraw({ provider, onSuccess, account }: WithdrawProps) {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const [status, setStatus] = useState<"loading" | "success" | "emergency">("loading");
    const [balance, setBalance] = useState("0");
    const [target, setTarget] = useState("0");
    const [withdrawalReason, setWithdrawalReason] = useState<string | null>(null);

    useEffect(() => {
        if (showModal) {
            setWithdrawalReason(null);
        }
    }, [showModal]);

    useEffect(() => {
        checkStatus();
    }, [provider, account]);

    const checkStatus = async () => {
        try {
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
            const vault = await contract.vaults(account);

            const bal = ethers.formatEther(vault[0] || 0); // indexed access
            const tgt = ethers.formatEther(vault[1] || 0);

            setBalance(bal);
            setTarget(tgt);

            // Logic: If balance >= target, it's a "Success" withdraw.
            // Otherwise, it's an "Emergency" withdraw.
            if (parseFloat(bal) >= parseFloat(tgt) && parseFloat(tgt) > 0) {
                setStatus("success");
            } else {
                setStatus("emergency");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setChecking(false);
        }
    };

    const handleWithdraw = async () => {
        setLoading(true);

        try {
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            const tx = await contract.emergencyWithdraw();
            toast.info("Processing withdrawal...", { description: "Please confirm the transaction." });
            await tx.wait();

            toast.success("Withdrawal Successful!", { description: status === "success" ? "Goal achieved! Funds claimed." : "Funds returned to wallet." });
            onSuccess();
            setShowModal(false);
        } catch (err: any) {
            console.error(err);
            toast.error("Withdrawal Failed", { description: err.reason || err.message });
        } finally {
            setLoading(false);
        }
    };

    if (checking) {
        return (
            <div className="flex justify-center p-8">
                <span className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const isSuccess = status === "success";

    return (
        <div className="max-w-md mx-auto">
            <div className={`relative group overflow-hidden rounded-[2rem] p-8 border backdrop-blur-xl transition-all duration-500 ${isSuccess ? 'bg-black/40 border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.2)]' : 'bg-black/40 border-red-500/30'}`}>
                {/* Decoration */}
                <div className={`absolute inset-0 bg-gradient-to-br opacity-10 pointer-events-none ${isSuccess ? 'from-green-500 via-emerald-500 to-teal-500' : 'from-red-600 via-orange-600 to-amber-600'}`} />

                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 border ${isSuccess ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-500'}`}>
                        {isSuccess ? <Award size={40} className="animate-pulse" /> : <AlertTriangle size={40} />}
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                        {isSuccess ? "Goal Achieved!" : "Emergency Protocol"}
                    </h2>

                    <p className="text-zinc-400 mb-8 leading-relaxed">
                        {isSuccess
                            ? `Congratulations! You have reached your savings target of ${target} ETH. You can now claim your funds reward-free.`
                            : "Withdrawing before your goal is met activates emergency protocols. This action is irreversible."
                        }
                    </p>

                    <div className="w-full bg-white/5 rounded-xl p-4 mb-8 border border-white/10">
                        <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">Available to Withdraw</p>
                        <p className={`text-3xl font-mono font-black ${isSuccess ? 'text-green-400' : 'text-white'}`}>
                            {parseFloat(balance).toFixed(4)} <span className="text-lg text-zinc-600 font-thin">ETH</span>
                        </p>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className={`w-full py-4 text-lg font-bold rounded-xl shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 ${isSuccess
                            ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-green-500/20'
                            : 'bg-red-600/10 hover:bg-red-600/20 border border-red-500/50 text-red-500'
                            }`}
                    >
                        {isSuccess ? (
                            <>
                                <Ticket size={20} /> Claim Savings
                            </>
                        ) : (
                            <>
                                <X size={20} /> Liquidate Vault
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-zinc-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-white/10 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-bold text-white">
                                {isSuccess ? "Claim Confirmation" : "Confirm Liquidation"}
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={loading}
                                className="text-zinc-500 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className={`border p-4 rounded-xl mb-6 ${isSuccess ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                            <p className={`text-sm font-semibold mb-1 flex items-center gap-2 ${isSuccess ? 'text-green-400' : 'text-red-400'}`}>
                                {isSuccess ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                                {isSuccess ? "Ready to Transfer" : "Warning"}
                            </p>
                            <p className={`${isSuccess ? 'text-green-300/80' : 'text-red-300/80'} text-sm leading-relaxed`}>
                                {isSuccess
                                    ? `Function execution will transfer ${balance} ETH to your wallet and close this vault session.`
                                    : `This action cannot be undone. All funds (${balance} ETH) will be returned immediately.`
                                }
                            </p>
                        </div>

                        {/* Reason Selector - Only for Emergency */}
                        {!isSuccess && (
                            <div className="mb-6 space-y-3">
                                <label className="text-zinc-400 text-sm font-medium">Why are you withdrawing early?</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {["Medical", "Family", "Job Loss", "Other"].map((reason) => (
                                        <button
                                            key={reason}
                                            onClick={() => setWithdrawalReason(reason)}
                                            className={`p-3 rounded-lg text-sm font-medium transition-all border ${withdrawalReason === reason
                                                ? "bg-red-500/20 border-red-500 text-red-400"
                                                : "bg-zinc-800 border-transparent text-zinc-400 hover:bg-zinc-700 hover:text-white"
                                                }`}
                                        >
                                            {reason}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Confirmation Reason Display */}
                        {!isSuccess && withdrawalReason && (
                            <div className="mb-6 p-4 bg-zinc-800/50 rounded-xl border border-white/5">
                                <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Confirm Reason</p>
                                <p className="text-white font-medium">{withdrawalReason}</p>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={loading}
                                className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleWithdraw}
                                disabled={loading || (!isSuccess && !withdrawalReason)}
                                className={`flex-1 py-3 px-4 text-white font-semibold rounded-xl shadow-lg transition-all flex justify-center items-center ${isSuccess
                                    ? 'bg-green-600 hover:bg-green-500 shadow-green-600/20'
                                    : 'bg-red-600 hover:bg-red-500 shadow-red-600/20'
                                    }`}
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    "Confirm"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
