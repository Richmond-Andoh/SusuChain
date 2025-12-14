import Image from "next/image";
import { Twitter, Github, BookOpen } from "lucide-react";

export default function Footer() {
    return (
        <footer className="relative z-10 w-full border-t border-white/5 bg-black/20 backdrop-blur-lg mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Logo & Brand */}
                    <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-white/10 shadow-[0_0_15px_rgba(6,182,212,0.1)] group cursor-pointer">
                            <Image
                                src="/logo.jpg"
                                alt="SusuChain Logo"
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white/90">
                            SusuChain
                        </span>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center gap-8">
                        <a href="#" className="group flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-cyan-400 transition-colors">
                            <Twitter size={16} className="group-hover:scale-110 transition-transform" />
                            <span className="hidden sm:inline">Twitter</span>
                        </a>
                        <a href="#" className="group flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-cyan-400 transition-colors">
                            <Github size={16} className="group-hover:scale-110 transition-transform" />
                            <span className="hidden sm:inline">GitHub</span>
                        </a>
                        <a href="#" className="group flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-cyan-400 transition-colors">
                            <BookOpen size={16} className="group-hover:scale-110 transition-transform" />
                            <span className="hidden sm:inline">Docs</span>
                        </a>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
                    <p>© 2024 SusuChain Protocol. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
