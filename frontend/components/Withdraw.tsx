import { useState } from "react";
import { ethers } from "ethers";
import { AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../lib/constants";

interface WithdrawProps {
    provider: ethers.BrowserProvider;
    onSuccess: () => void;
}

export default function Withdraw({ provider, onSuccess }: WithdrawProps) {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleWithdraw = async () => {
        setLoading(true);

        try {
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

            const tx = await contract.emergencyWithdraw();
            toast.info("Processing withdrawal...", { description: "Please confirm the transaction." });
            await tx.wait();

            toast.success("Withdrawal Successful!", { description: "Your funds have been returned." });
            onSuccess();
            setShowModal(false);
        } catch (err: any) {
            console.error(err);
            toast.error("Withdrawal Failed", { description: err.reason || err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm text-center">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
                    Emergency Withdraw
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">
                    Need access to your funds immediately? You can withdraw your entire balance at any time.
                </p>

                <button
                    onClick={() => setShowModal(true)}
                    className="w-full py-3 px-6 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold rounded-xl border border-red-200 dark:border-red-800 transition-all"
                >
                    Withdraw All Funds
                </button>
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-sm w-full p-6 shadow-xl border border-zinc-200 dark:border-zinc-800 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                                Are you sure?
                            </h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl mb-6">
                            <p className="text-amber-800 dark:text-amber-200 text-sm font-medium">
                                ⚠️ This action cannot be undone.
                            </p>
                            <p className="text-amber-700 dark:text-amber-300 text-sm mt-1">
                                Your vault will be closed and all funds will be returned to your wallet immediately.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                disabled={loading}
                                className="flex-1 py-3 px-4 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleWithdraw}
                                disabled={loading}
                                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-md transition-all disabled:opacity-70 flex justify-center items-center"
                            >
                                {loading ? (
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    "Confirm"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
