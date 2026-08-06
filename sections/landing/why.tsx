"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { TrendingUp, ChartColumn } from "lucide-react";
import { useReveal } from "../hooks/use-reveal";
import type { ReactNode } from "react";

type WhyCardProps = {
    icon: ReactNode;
    iconBg: string;
    title: string;
    description: string;
    delay: number;
};

function WhyCard({ icon, iconBg, title, description, delay }: WhyCardProps) {
    const { ref, isVisible } = useReveal<HTMLDivElement>();

    return (
        <Card
            ref={ref}
            className="group flex flex-col bg-white shadow-2xl items-center justify-center w-full md:w-1/3 lg:w-107.5 max-w-107.5 py-8 sm:py-10 lg:py-13 gap-6 sm:gap-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)]"
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? "translateY(0)" : "translateY(32px)",
                transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
            }}
        >
            <div className="flex flex-col items-center gap-5 sm:gap-6 lg:gap-8 w-full max-w-92 px-6">
                <div
                    className="flex size-16 sm:size-18 lg:size-20 items-center justify-center rounded-[16px] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                    style={{ backgroundColor: iconBg }}
                >
                    {icon}
                </div>
                <p className="text-h4 sm:text-h3 font-bold text-center">{title}</p>
                <p className="text-sh-s sm:text-sh-m text-center">{description}</p>
            </div>
        </Card>
    );
}

export default function Why() {
    const { ref: introRef, isVisible: introVisible } = useReveal<HTMLDivElement>();

    const items: Omit<WhyCardProps, "delay">[] = [
        {
            icon: <TrendingUp className="size-8 sm:size-9 lg:size-10" color="#D74A6A" />,
            iconBg: "#FFE4E6",
            title: "MRV Eksisting Mahal",
            description:
                "Proses pemantauan saat ini didominasi satelit dan AI yang butuh biaya besar, menutup akses bagi pengembang proyek skala kecil.",
        },
        {
            icon: <ChartColumn className="size-8 sm:size-9 lg:size-10" color="#DA7C0E" />,
            iconBg: "#FEF3C7",
            title: "Kalkulasi Terfragmentasi",
            description:
                "Perhitungan karbon sering tidak terstandarisasi. CarbonTide menggunakan sistem rule-based transparan berstandar Verra.",
        },
        {
            icon: <TrendingUp className="size-8 sm:size-9 lg:size-10" color="#3C73EE" />,
            iconBg: "#EFF6FF",
            title: "Akses Pasar Terbatas",
            description:
                "Belum ada marketplace terintegrasi end-to-end. Kami menghubungkan suplai komunitas langsung dengan demand ESG perusahaan.",
        },
    ];

    return (
        <div className="flex flex-col items-center w-full max-w-342 px-5 sm:px-8 lg:px-0 gap-6 sm:gap-8 lg:gap-10">
            <div
                ref={introRef}
                style={{
                    opacity: introVisible ? 1 : 0,
                    transform: introVisible ? "translateY(0)" : "translateY(20px)",
                    transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
                }}
                className="flex flex-col items-center gap-6 sm:gap-8 lg:gap-10 w-full"
            >
                <div className="flex flex-row flex-wrap justify-center items-center gap-2 sm:gap-3 text-h4 sm:text-h2 lg:text-h1 font-bold text-center">
                    <p>Mengapa</p>
                    <Image
                        src="/images/logo.png"
                        width={200}
                        height={175}
                        alt="Logo CarbonTide"
                        className="h-8 sm:h-12 lg:h-auto w-auto transition-transform duration-300 hover:scale-110"
                    />
                    <p>Hadir?</p>
                </div>

                <p className="w-full max-w-270.5 text-center text-sh-s sm:text-sh-m lg:text-sh-l">
                    Indonesia memiliki 17% cadangan blue carbon global (3,0 Pg C),
                    namun realisasinya di pasar karbon masih kurang dari 3%.
                    Kesenjangan ini disebabkan oleh hambatan struktural MRV yang kompleks.
                </p>
            </div>

            <div className="flex flex-col md:flex-row w-full items-center md:items-stretch justify-center gap-5">
                {items.map((item, i) => (
                    <WhyCard key={item.title} {...item} delay={i * 120} />
                ))}
            </div>
        </div>
    );
}