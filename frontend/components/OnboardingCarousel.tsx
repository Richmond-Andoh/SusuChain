"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface OnboardingCarouselProps {
    onConnect: () => void;
    loading: boolean;
}

const slides = [
    {
        id: 1,
        image: "/onboarding_save.png",
        title: "Save Small, Dream Big",
        description: "Build your emergency fund one deposit at a time. Consistent small steps lead to big safety nets.",
    },
    {
        id: 2,
        image: "/onboarding_lock.png",
        title: "Securely Locked",
        description: "Your funds are locked in a smart contract. No temptations, just disciplined saving on the blockchain.",
    },
    {
        id: 3,
        image: "/onboarding_goal.png",
        title: "Reach Your Goals",
        description: "Track your progress and celebrate when you hit your target. Financial freedom starts here.",
    },
];

export default function OnboardingCarousel({ onConnect, loading }: OnboardingCarouselProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide((prev) => prev + 1);
        }
    };

    return (
        <div className="flex flex-col h-full w-full max-w-md mx-auto relative overflow-hidden">
            {/* Carousel Track */}
            <div
                className="flex transition-transform duration-500 ease-out h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
                {slides.map((slide) => (
                    <div key={slide.id} className="w-full flex-shrink-0 flex flex-col items-center justify-center p-8 text-center space-y-8">
                        <div className="relative w-64 h-64 md:w-80 md:h-80">
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                className="object-contain drop-shadow-2xl"
                                priority
                            />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">
                                {slide.title}
                            </h2>
                            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                                {slide.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="absolute bottom-8 left-0 right-0 px-8 flex flex-col items-center gap-8">
                {/* Dots */}
                <div className="flex gap-2">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentSlide === index
                                    ? "bg-indigo-600 w-8"
                                    : "bg-zinc-300 dark:bg-zinc-700"
                                }`}
                        />
                    ))}
                </div>

                {/* Button */}
                <div className="w-full">
                    {currentSlide === slides.length - 1 ? (
                        <button
                            onClick={onConnect}
                            disabled={loading}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-2xl shadow-xl shadow-indigo-500/20 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? "Connecting..." : "Get Started"}
                        </button>
                    ) : (
                        <button
                            onClick={nextSlide}
                            className="w-full py-4 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold text-lg rounded-2xl shadow-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all active:scale-95"
                        >
                            Next <ChevronRight size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
