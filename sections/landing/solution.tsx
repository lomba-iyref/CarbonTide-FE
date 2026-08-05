"use client";

import {
    Card,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleCheck, Calculator, ArrowRight } from 'lucide-react';
import { useReveal } from "@/hooks/use-reveal";

function CalculatorSection() {
    const { ref, isVisible } = useReveal<HTMLDivElement>();

    return (
        <div
            ref={ref}
            className="relative lg:-translate-y-10 flex flex-col items-center gap-4 w-full lg:w-130 xl:w-156.5"
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(32px)",
                transition: "opacity 0.6s ease-out 0.2s, transform 0.6s ease-out 0.2s",
            }}
        >
            <style>{`
                @keyframes calc-float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }
            `}</style>
            <div className="flex justify-end w-full py-2 border-b-[#94A3B8] border-b">
                <Calculator
                    className="items-end"
                    color="#8EC1EF"
                    style={{ animation: "calc-float 3s ease-in-out infinite" }}
                />
            </div>
            <Card className="group flex flex-col items-center gap-7 w-full bg-[#1E293B] border-[#283346] border-2 px-4 sm:px-6 lg:px-0 transition-all duration-300 hover:border-[#8EC1EF]/60 hover:shadow-[0_20px_50px_-12px_rgba(142,193,239,0.25)]">
                <div className="flex flex-col justify-center w-full lg:w-100 xl:w-130 gap-5 sm:gap-7 py-2 lg:py-0">
                    <div className="flex flex-col justify-center w-full min-h-20 sm:h-23 text-c-l gap-2 sm:gap-3 pl-4 sm:pl-5 py-3 bg-tertiary border-[#566A87] border rounded-[8px] transition-colors duration-300 hover:border-[#8EC1EF]/60">
                        <p className="text-text-secondary">Input DBH & Tinggi</p>
                        <p className="text-[#8EC1EF] wrap-break-word">AGB = 0.0673 × (ρD²H)⁰.⁹⁷⁶</p>
                    </div>
                    <div className="flex flex-col justify-center w-full min-h-20 sm:h-23 text-c-l gap-2 sm:gap-3 pl-4 sm:pl-5 py-3 bg-tertiary border-[#566A87] border rounded-[8px] transition-colors duration-300 hover:border-[#8EC1EF]/60">
                        <p className="text-text-secondary">Konversi Karbon</p>
                        <p className="text-secondary wrap-break-word">AGB = 0.0673 × (ρD²H)⁰.⁹⁷⁶</p>
                    </div>
                    <Button className="group/btn flex flex-row items-center justify-center gap-2 w-full lg:w-100 xl:w-130 h-12 sm:h-14.5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0">
                        <p className="text-sh-s sm:text-sh-l font-bold">Coba Calculator MRV</p>
                        <ArrowRight className="size-6 sm:size-8 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                    </Button>
                </div>
            </Card>
        </div>
    )
}

type StepItemProps = {
    title: string;
    description: string;
    delay: number;
};

function StepItem({ title, description, delay }: StepItemProps) {
    const { ref, isVisible } = useReveal<HTMLDivElement>();

    return (
        <div
            ref={ref}
            className="group flex flex-row items-start sm:items-center gap-3 sm:gap-4"
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateX(0)" : "translateX(-24px)",
                transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
            }}
        >
            <CircleCheck
                className="relative size-9 sm:size-10 lg:size-12 shrink-0 transition-transform duration-300 group-hover:scale-110"
                color="#8EC1EF"
            />
            <div className="flex flex-col gap-2 sm:gap-3">
                <p className="font-bold text-sh-m sm:text-sh-l">{title}</p>
                <p className="text-[#94A3B8] text-sh-s sm:text-sh-m w-full lg:w-100 xl:w-140">
                    {description}
                </p>
            </div>
        </div>
    );
}

export default function Solution() {
    const { ref: headerRef, isVisible: headerVisible } = useReveal<HTMLDivElement>();

    const steps: Omit<StepItemProps, "delay">[] = [
        {
            title: "1. Input Lapangan Berbasis Plot",
            description:
                "Menggunakan data real seperti DBH dan tinggi pohon (tanpa ketergantungan AI) untuk mengestimasi biomassa via persamaan alometrik.",
        },
        {
            title: "2. Auto-MRV Report Generator",
            description:
                "Sistem mengubah input mentah secara otomatis menjadi laporan karbon tervalidasi yang siap diaudit (Verification Layer).",
        },
        {
            title: "3. Marketplace Terhubung",
            description:
                "Kredit yang tervalidasi langsung terbit di inventory penjual dan siap dibeli oleh perusahaan untuk komitmen ESG mereka.",
        },
    ];

    return (
        <Card className="flex flex-col gap-6 sm:gap-8 lg:gap-10 w-full max-w-342 bg-tertiary py-8 sm:py-10 lg:py-15 px-5 sm:px-6 lg:px-10 justify-center text-white mx-5 sm:mx-8 lg:mx-0">
            <CardHeader
                ref={headerRef}
                className="p-0"
                style={{
                    opacity: headerVisible ? 1 : 0,
                    transform: headerVisible ? "translateY(0)" : "translateY(16px)",
                    transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
                }}
            >
                <CardTitle className="font-bold text-2xl sm:text-3xl lg:text-4xl">
                    Solusi Terintegrasi (All-in-One)
                </CardTitle>
            </CardHeader>
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex flex-col gap-6 sm:gap-7">
                    {steps.map((step, i) => (
                        <StepItem key={step.title} {...step} delay={i * 150} />
                    ))}
                </div>
                <CalculatorSection />
            </div>
        </Card>
    )
}