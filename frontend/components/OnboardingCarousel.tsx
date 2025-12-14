"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRight, Sparkles } from "lucide-react";

interface OnboardingCarouselProps {
    onComplete: () => void;
}

const slides = [
    {
        id: 1,
        image: "/onboarding_save.png",
        title: "Save Small, Dream Big",
        description: "Build your emergency fund one deposit at a time. Consistent small steps lead to big safety nets.",
        gradient: "from-indigo-500/20 via-purple-500/20 to-pink-500/20",
    },
    {
        id: 2,
        image: "/onboarding_lock.png",
        title: "Securely Locked",
        description: "Your funds are locked in a smart contract. No temptations, just disciplined saving on the blockchain.",
        gradient: "from-blue-500/20 via-cyan-500/20 to-teal-500/20",
    },
    {
        id: 3,
        image: "/onboarding_goal.png",
        title: "Reach Your Goals",
        description: "Track your progress and celebrate when you hit your target. Financial freedom starts here.",
        gradient: "from-emerald-500/20 via-green-500/20 to-lime-500/20",
    },
];

export default function OnboardingCarousel({ onComplete }: OnboardingCarouselProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide((prev) => prev + 1);
        }
    };

    return (
        <div className="flex flex-col min-h-screen w-full max-w-md mx-auto relative overflow-hidden bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-black dark:via-zinc-950 dark:to-black">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r ${slides[currentSlide].gradient} rounded-full blur-3xl opacity-30 animate-pulse`} />
                <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r ${slides[currentSlide].gradient} rounded-full blur-3xl opacity-20 animate-pulse delay-1000`} />
            </div>

            {/* Web3 Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            {/* Main Content Container */}
            <div className="flex-1 flex flex-col relative z-10 pb-32 pt-12 sm:pt-16 px-6">
                {/* Carousel Track */}
                <div
                    className="flex transition-transform duration-700 ease-out flex-1"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {slides.map((slide, index) => (
                        <div 
                            key={slide.id} 
                            className="w-full flex-shrink-0 flex flex-col items-center justify-center min-h-full"
                        >
                            <div className="w-full max-w-sm mx-auto space-y-8 sm:space-y-10">
                                {/* Image Container with Web3 Glow Effect */}
                                <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[320px] mx-auto">
                                    {/* Glow Effect */}
                                    <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient} rounded-3xl blur-2xl opacity-40 animate-pulse`} />
                                    
                                    {/* Image */}
                                    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 dark:border-zinc-800/50 backdrop-blur-sm">
                                        <Image
                                            src={slide.image}
                                            alt={slide.title}
                                            fill
                                            className="object-cover"
                                            priority={index === 0}
                                        />
                                    </div>
                                    
                                    {/* Decorative Sparkles */}
                                    <div className="absolute -top-2 -right-2 text-indigo-400/60 animate-pulse">
                                        <Sparkles size={24} />
                                    </div>
                                </div>

                                {/* Text Content */}
                                <div className="space-y-4 px-2">
                                    <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tight leading-tight">
                                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                                            {slide.title}
                                        </span>
                                    </h2>
                                    <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-md mx-auto">
                                        {slide.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fixed Bottom Controls - Ensures no overlap */}
            <div className="fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-zinc-50/95 via-zinc-50/90 to-transparent dark:from-black/95 dark:via-black/90 backdrop-blur-md border-t border-zinc-200/50 dark:border-zinc-800/50">
                <div className="max-w-md mx-auto px-6 py-6 sm:py-8 space-y-6">
                    {/* Dots Indicator */}
                    <div className="flex items-center justify-center gap-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className="focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full transition-all duration-300"
                                aria-label={`Go to slide ${index + 1}`}
                            >
                                <div
                                    className={`h-2.5 rounded-full transition-all duration-500 ease-out ${
                                        currentSlide === index
                                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 w-10 shadow-lg shadow-indigo-500/50"
                                            : "bg-zinc-300 dark:bg-zinc-700 w-2.5 hover:bg-zinc-400 dark:hover:bg-zinc-600"
                                    }`}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Action Button */}
                    <div className="w-full">
                        {currentSlide === slides.length - 1 ? (
                            <button
                                onClick={onComplete}
                                className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold text-lg rounded-2xl shadow-xl shadow-indigo-500/30 dark:shadow-indigo-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
                            >
                                {/* Shimmer Effect */}
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                <span className="relative flex items-center justify-center gap-2">
                                    Get Started
                                    <Sparkles size={20} className="animate-pulse" />
                                </span>
                            </button>
                        ) : (
                            <button
                                onClick={nextSlide}
                                className="w-full py-4 px-6 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm text-zinc-900 dark:text-white font-semibold text-lg rounded-2xl shadow-lg border-2 border-zinc-200/50 dark:border-zinc-700/50 flex items-center justify-center gap-2 hover:bg-white dark:hover:bg-zinc-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] group"
                            >
                                <span>Next</span>
                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
